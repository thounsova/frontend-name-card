
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserDeleteDialog } from "@/store/user-delete-dialog-store";

const UserDeleteAlertDialog = ({
  onConfirm,
  isLoading,
}: {
  onConfirm: () => void;
  isLoading?: boolean;
}) => {
  const { isOpen, userName, closeDialog } = useUserDeleteDialog();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this user?</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone.
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteAlertDialog;
