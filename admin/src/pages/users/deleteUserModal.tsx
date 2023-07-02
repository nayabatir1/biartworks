import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { User } from "../../shared/types";
import { useDeleteUser } from "../../hooks/users.hooks";

interface Props {
  show: boolean;
  onHide: () => void;
  selected: User;
}

const DeleteUserModal = ({ show, onHide, selected }: Props) => {
  const { mutateAsync, isLoading } = useDeleteUser();

  const remove = async () => {
    await mutateAsync(selected.id);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete user
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Are sure you want to delete {selected.name}?</h4>

        <Button variant="danger" onClick={remove} disabled={isLoading}>
          Yes
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteUserModal;
