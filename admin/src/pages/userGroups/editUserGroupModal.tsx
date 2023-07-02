import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEditUserGroups } from "../../hooks/userGroups.hooks";
import { UserGroups } from "../../shared/types";
import { useEffect } from "react";

interface Props {
  show: boolean;
  onHide: () => void;
  selected: UserGroups;
}

const defaultValues = {
  type: "",
};

const schema = yup.object().shape({
  type: yup.string().trim().required("Type is required"),
});

const EditUserGroupModal = ({ show, onHide, selected }: Props) => {
  const {
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset({ type: selected.type });
  }, [selected.type, reset]);

  const { mutateAsync } = useEditUserGroups();

  const submit = handleSubmit(async (data) => {
    await mutateAsync({ body: data, id: selected.id });
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
            <Form.Label>User group type</Form.Label>
            <Form.Control type="text" {...register("type")} />
            {!!errors.type && (
              <Form.Text className="small text-danger">
                {errors.type.message}
              </Form.Text>
            )}
          </Form.Group>
          <Button className="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserGroupModal;
