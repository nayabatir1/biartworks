import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useGetUserGroups } from "../../hooks/userGroups.hooks";
import { useAddUser } from "../../hooks/send-invite-hooks";
import Select from "react-select";
import { useEffect, useMemo } from "react";
import { User } from "../../shared/types";
import { useUpdateUser } from "../../hooks/users.hooks";

interface Props {
  show: boolean;
  onHide: () => void;
  user?: User;
}

interface Schema {
  email: string;
  groups: Array<{ value: string; label: string }>;
}

const defaultValues = {
  email: "",
  groups: [],
};

const schema = yup.object<Schema>().shape({
  email: yup.string().email().required("Email is required"),
  groups: yup
    .array()
    .of(yup.object({ value: yup.string(), label: yup.string() })),
});

const AddUserModal = ({ show, onHide, user }: Props) => {
  const {
    handleSubmit,
    register,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!user) return;

    reset({
      email: user.email,
      groups: user.groups.map((g) => ({ label: g.type, value: g.id })),
    });
  }, [reset, user]);

  const { data } = useGetUserGroups({ limit: 100, page: 1 });
  const { mutateAsync } = useAddUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  const options = useMemo(() => {
    if (data)
      return data?.data.docs.map((d) => ({
        value: d.id,
        label: d.type,
      }));

    return [];
  }, [data]);

  const submit = handleSubmit(async ({ email, groups }: Schema) => {
    if (user) {
      // update user
      const groupIds = groups.map((g) => g.value);
      await updateUser({ id: user.id, body: { groupIds } });
    } else if (!groups[0]) await mutateAsync({ email });
    // create user without group
    else {
      const groupIds = groups.map((g) => g.value);
      await mutateAsync({ email, groupIds }); // create user with group
    }
    reset();

    onHide();
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      onExiting={() => clearErrors}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add user group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" {...register("email")} />
            {!!errors.email && (
              <Form.Text className="small text-danger">
                {errors.email.message}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>User group</Form.Label>
            <Controller
              name="groups"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select
                  value={value}
                  onBlur={onBlur}
                  isMulti
                  onChange={onChange}
                  options={options}
                  ref={ref}
                />
              )}
            />
          </Form.Group>

          <Button className="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;
