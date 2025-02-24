import { useState } from "react";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/textfield";

interface UserFormProps {
  type: "customer" | "employer";
  status: "post" | "edit";
  setOpen: (open: boolean) => void;
  
}

export default function UserForm({ type, setOpen }: UserFormProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  return (
    <div>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="md" className="mb-1" weight="bold">
            Name
          </Text>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter your ${type} full name`}
          />
        </label>
        <label>
          <Text as="div" size="md" className="mb-1" weight="bold">
            Email or phone
          </Text>
          <TextField
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={`Enter your ${type} email or phone number`}
          />
        </label>
      </Flex>

      {type === "employer" && (
        <Flex justify="between">
          <label>
            <Text as="div" size="md" className="mb-1" weight="bold">
              Authorization:
            </Text>
            <select multiple className="border p-2 rounded w-full">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>
          <label>
            <Text as="div" size="md" className="mb-1" weight="bold">
              Status:
            </Text>
            <select className="border p-2 rounded w-full">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </label>
        </Flex>
      )}
      <Flex gap="3" justify="end" className="mt-4">
        <Button variant="soft" color="gray" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setOpen(false)}>Save</Button>
      </Flex>
    </div>
  );
}
