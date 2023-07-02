import SideNavigaiton from "../../components/SideNavigaiton";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useGetUserGroups } from "../../hooks/userGroups.hooks";
import { useState } from "react";
import AddUserGroupModal from "./addUserGroupModal";
import CustomPagination from "../../components/Pagination";
import DeleteUserGroupModal from "./deleteUserGroupModal";
import { UserGroups } from "../../shared/types";
import EditUserGroupModal from "./editUserGroupModal";
import { Link } from "react-router-dom";

const UserGroup = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState<UserGroups>({ id: "", type: "" });
  const [query, setQuery] = useState({ page: 1, limit: 10 });

  const setPageNo = (pageNo: number) =>
    setQuery((p) => ({ ...p, page: pageNo }));

  const { data, isLoading } = useGetUserGroups(query);

  const { pagination } = data?.data || {
    pagination: null,
  };

  const toggleAddModal = () => setShowAddModal((p) => !p);
  const toggleDeleteModal = () => setShowDeleteModal((p) => !p);
  const toggleEditModal = () => setShowEditModal((p) => !p);

  return (
    <>
      <SideNavigaiton>
        <Container>
          <Row className="mt-3">
            <Col>
              <p className="h2 text-uppercase">user groups</p>
            </Col>
            <Col>
              <Button className="float-end" onClick={toggleAddModal}>
                Add user group
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.docs.map((d, i) => (
                    <tr key={d.id}>
                      <td>
                        {(data.data.pagination.currentPage - 1) *
                          data.data.pagination.limit +
                          i +
                          1}
                      </td>
                      <td>
                        <Link to={`/users/${d.id}`}>{d.type}</Link>
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faPencil}
                          color="blue"
                          onClick={() => {
                            setSelected(d);
                            toggleEditModal();
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="ms-3"
                          color="red"
                          onClick={() => {
                            setSelected(d);
                            toggleDeleteModal();
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {!isLoading && pagination && (
                <CustomPagination {...pagination} setPageNo={setPageNo} />
              )}
            </Col>
          </Row>
        </Container>
      </SideNavigaiton>
      <AddUserGroupModal show={showAddModal} onHide={toggleAddModal} />
      <DeleteUserGroupModal
        show={showDeleteModal}
        onHide={toggleDeleteModal}
        selected={selected}
      />
      <EditUserGroupModal
        show={showEditModal}
        onHide={toggleEditModal}
        selected={selected}
      />
    </>
  );
};

export default UserGroup;
