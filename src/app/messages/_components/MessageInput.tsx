"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default const MessageInput = ({
  onSend,
}: {
  onSend: (message: string) => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const message = formData.get("message") as string;
    if (message.trim()) {
      onSend(message);
      (e.currentTarget as HTMLFormElement).reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          name="message"
          placeholder="Type a message..."
          className="resize-none min-h-[40px] py-2 rounded-2xl"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          className="rounded-full h-10 w-10 p-2 bg-blue-500 hover:bg-blue-600"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M3 13h6v-2H3V2.586a1 1 0 0 1 2 0V11h6V3.414a1 1 0 0 1 2 0V11h6V4.414a1 1 0 0 1 2 0V19h-6v-5h-6v5H5V13z" />
    </svg>
  );
}
