import { parse, isValid, format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Product = {
  id: string;
  date: string;
  Qte?: number;
  designation: string;
  idProduct: string;
  comments: string;
  amount: number;
  total?: number;
  dateObject?: Date;
  _search?: string;
};

type SearchConditions = {
  dateFilters: Date[];
  textTerms: string[];
};

const DATE_FORMATS = [
  'dd/MM/yyyy',
  'dd-MM-yyyy',
  'yyyy/MM/dd',
  'yyyy-MM-dd',
  'dd MMM yyyy',
  'dd MMM',
  'MMM yyyy',
  'MMM',
  'yyyy',
];

/**
 * Parse une chaîne de recherche en conditions de recherche
 */
export function parseSearchQuery(searchInput: string): SearchConditions {
  const terms = searchInput.toLowerCase().split(/\s+/);
  const results: SearchConditions = {
    dateFilters: [],
    textTerms: []
  };

  terms.forEach(term => {
    let dateFound = false;
    
    // Essayer de parser avec différents formats
    for (const fmt of DATE_FORMATS) {
      const parsedDate = parse(term, fmt, new Date(), { locale: fr });
      if (isValid(parsedDate)) {
        results.dateFilters.push(parsedDate);
        dateFound = true;
        break;
      }
    }

    // Vérifier les formats complexes comme "23-mars-2024"
    if (!dateFound) {
      const complexDate = parse(term, 'dd-MMM-yyyy', new Date(), { locale: fr });
      if (isValid(complexDate)) {
        results.dateFilters.push(complexDate);
        dateFound = true;
      }
    }

    if (!dateFound) {
      results.textTerms.push(term);
    }
  });

  return results;
}

/**
 * Crée un index de recherche pour des données
 */
export function createSearchIndex(data: Product[], keys: (keyof Product)[]): Product[] {
  return data.map(item => ({
    ...item,
    _search: keys
      .map(k => item[k]?.toString().toLowerCase() || '')
      .join(' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''),
  }));
}


/**
 * Filtre les données selon les conditions de recherche
 */
export function filterData<T extends { _search: string; dateObject: Date }>(
  data: T[],
  conditions: SearchConditions
): T[] {
  const { dateFilters, textTerms } = conditions;

  return data.filter(item => {
    // Vérification des dates
    const dateMatch = dateFilters.length === 0 || dateFilters.some(filterDate => {
      const itemDate = item.dateObject;
      if (!itemDate) return false; // Évite les erreurs si `dateObject` est `undefined`
      return (
        format(filterDate, 'yyyy-MM-dd') === format(itemDate, 'yyyy-MM-dd') ||
        format(filterDate, 'yyyy-MM') === format(itemDate, 'yyyy-MM') ||
        format(filterDate, 'yyyy') === format(itemDate, 'yyyy')
      );
    });

    // Vérification du texte
    const textMatch = textTerms.length === 0 || 
      textTerms.every(term => item._search.includes(term));

    return dateMatch && textMatch;
  });
}
