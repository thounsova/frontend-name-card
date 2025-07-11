import * as React from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";


export const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <HeadlessDialog open={open} onClose={onOpenChange} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <HeadlessDialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md">
          {children}
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};