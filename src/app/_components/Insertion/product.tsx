"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProduct({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvel article en stock</DialogTitle>
          <DialogDescription>
            Remplis les informations du produit à ajouter.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          {/* 🔧 Ajoute ici tes champs inputs */}
        </form>
        <DialogFooter>
          <DialogClose className="btn-secondary">Annuler</DialogClose>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
