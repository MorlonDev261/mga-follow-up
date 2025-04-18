import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function StockFormDialog() {
  return (
    <Dialog>
      <DialogTrigger className="btn-primary">Ajouter un stock</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvel article en stock</DialogTitle>
          <DialogDescription>
            Remplis les informations du produit à ajouter.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          {/* Inputs ici */}
        </form>
        <DialogFooter>
          <DialogClose className="btn-secondary">Annuler</DialogClose>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
