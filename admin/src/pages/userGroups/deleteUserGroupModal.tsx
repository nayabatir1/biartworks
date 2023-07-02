import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useRemoveUserGroups } from "../../hooks/userGroups.hooks";
import { UserGroups } from "../../shared/types";

interface Props {
  show: boolean;
  onHide: () => void;
  selected: UserGroups;
}

const DeleteUserGroupModal = ({ show, onHide, selected }: Props) => {
  const { mutateAsync } = useRemoveUserGroups();

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
          Delete user group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Are sure you want to delete {selected.type}?</h4>

        <Button variant="danger" onClick={remove}>
          Yes
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteUserGroupModal;
