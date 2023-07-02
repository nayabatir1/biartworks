import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import SideNavigaiton from "../../components/SideNavigaiton";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import debounce from "../../Utils/debounce";
import { Query, User } from "../../shared/types";
import { useGetUsers } from "../../hooks/users.hooks";
import CustomPagination from "../../components/Pagination";
import dayjs from "dayjs";
import AddUserModal from "./addUserModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteUserModal from "./deleteUserModal";
import { useParams } from "react-router-dom";

const bounecer = debounce(1000);

const Users = () => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<User>();

  const [query, setQuery] = useState<Query>({ page: 1, limit: 10 });

  const setPageNo = (page: number) => setQuery((p) => ({ ...p, page }));

  const toggleDeleteModal = () => setShowDeleteModal((p) => !p);

  const { id } = useParams();

  const { data, isLoading } = useGetUsers(query, id);

  const pagination = useMemo(() => {
    const { pagination } = data?.data || {
      pagination: null,
    };

    return pagination;
  }, [data]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    bounecer(() => setQuery((p) => ({ ...p, search: e.target.value })));
  };

  const toggleModal = () => setShow((p) => !p);

  console.log("selected", !!selected);

  const clearSelectedAndToggleDeleteModal = () => {
    setSelected(undefined);
    toggleDeleteModal();
  };

  const clearSelectedAndToggleModal = () => {
    setSelected(undefined);
    toggleModal();
  };

  return (
    <>
      <SideNavigaiton>
        <Container>
          <Row className="mt-1">
            <Col>
              <span className="h2 text-uppercase">users</span>

              <Button className="float-end" onClick={toggleModal}>
                Send Invite
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4} lg={4}>
              <Form.Group controlId="email">
                <Form.Control
                  type="email"
                  onChange={handleSearch}
                  value={search}
                  className="border-0 border-bottom rounded-0"
                />
                <Form.Label>Search</Form.Label>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Groups</th>
                    <th>Invite sent on</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.docs.map((d) => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.email}</td>
                      <td>
                        {d.groups.map((g) => (
                          <span className="user-group" key={g.id}>
                            {g.type}
                          </span>
                        ))}
                      </td>
                      <td>{dayjs(d.createdAt).format("YYYY-MM-DD")}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={faPencil}
                          color="blue"
                          onClick={() => {
                            setSelected(d);
                            toggleModal();
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
      <AddUserModal
        show={show}
        onHide={clearSelectedAndToggleModal}
        user={selected}
      />
      {!!selected && (
        <DeleteUserModal
          show={showDeleteModal}
          onHide={clearSelectedAndToggleDeleteModal}
          selected={selected}
        />
      )}
    </>
  );
};

export default Users;
