import { Button } from "@/components/ui/button";
import { endpoint } from "@/constants/endpoint";
import useApi from "@/hooks/useApi";
import type { User } from "@/types/users";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

interface UserEditFormProps {
  user: User;
  setIsEditing: (isediting: boolean) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  status: Yup.string()
    .oneOf(["Active", "Pending", "Inactive"], "Invalid status")
    .required("Status is required"),
});

const UserEditForm = (props: UserEditFormProps) => {
  const { id } = useParams();
  const { updateUser } = useApi();
  const { user, setIsEditing } = props;
  const queryClient = useQueryClient();

  const handleSubmit = async (values: any) => {
    if (!id) return;

    try {
      const response = await updateUser(endpoint.updateUser, id, values);

      if (response.success) {
        console.log("User updated successfully:", response.data);
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ["user", id] });

        // Optional: show success toast
      } else {
        console.error("Update failed:", response.error);
        // Optional: show error toast
      }
    } catch (ex) {
      console.error("Unexpected error:", ex);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          name: user?.name || "",
          role: user?.role || "",
          email: user?.email || "",
          status: user?.status || "Active",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 mt-2">
            <div>
              <label className="block font-medium">Name</label>
              <Field
                name="name"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <Field
                name="email"
                type="email"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Role</label>
              <Field
                name="role"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Status</label>
              <Field
                as="select"
                name="status"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 dark:text-white"
            >
              Save Changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserEditForm;
