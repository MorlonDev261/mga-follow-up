import { useState } from "react";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/textfield";

interface UserFormProps {
  type: "customer" | "employer";
  status: "post" | "edit";
}

export function UserForm({ type }: UserFormProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  return (
    <>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Root
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter your ${type} full name`}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Email or phone
          </Text>
          <TextField.Root
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={`Enter your ${type} email or phone number`}
          />
        </label>
      </Flex>

      {type === "employer" && (
        <Flex justify="between">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Authorization:
            </Text>
            <select multiple className="border p-2 rounded w-full">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
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
    </>
  );
}
