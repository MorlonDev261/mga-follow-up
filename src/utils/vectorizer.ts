import db from '@/lib/db';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from 'langchain/document';

export async function getSimilarContext(query: string): Promise<string> {
  // 1. Charger les données de la base
  const data = await db.assistantContext.findMany();

  if (data.length === 0) return 'Aucun contexte n’est disponible.';

  // 2. Créer les documents formatés pour LangChain
  const docs = data.map(d =>
    new Document({
      pageContent: `Q: ${d.question}\nR: ${d.answer}`,
      metadata: { id: d.id }
    })
  );

  // 3. Couper les documents si nécessaires (facultatif ici)
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 200, chunkOverlap: 20 });
  const splitDocs = await splitter.splitDocuments(docs);

  // 4. Créer le vecteur sémantique en mémoire
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new OpenAIEmbeddings());

  // 5. Recherche sémantique : les 3 résultats les plus pertinents
  const results = await vectorStore.similaritySearch(query, 3);

  // 6. Formater le contexte à injecter dans l’IA
  return results.map(doc => doc.pageContent).join('\n\n');
}
