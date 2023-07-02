import { Container, Row, Col, Pagination } from "react-bootstrap";
import usePagination from "../hooks/pagination.hooks";

interface Props {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
  totalPages: number;
  setPageNo: (arg0: number) => void;
}

const CustomPagination = ({
  hasNextPage,
  hasPrevPage,
  currentPage,
  totalPages,
  setPageNo,
}: Props) => {
  const pagination = usePagination({
    totalPages,
    siblingCount: 1,
    currentPage,
  });

  return (
    <Container>
      <Row>
        <Col
          xs={12}
          className="d-flex justify-content-center justify-content-md-end my-4"
        >
          <Pagination>
            <Pagination.First
              disabled={currentPage < 2}
              onClick={() => setPageNo(1)}
            />
            <Pagination.Prev
              disabled={!hasPrevPage}
              onClick={() => setPageNo(currentPage - 1)}
            />
            {pagination?.map((e, idx) => {
              if (e === "DOTS")
                return <Pagination.Ellipsis key={`${e}-${idx}`} />;
              return (
                <Pagination.Item
                  key={`${e}-${idx}`}
                  active={currentPage === e}
                  onClick={() => setPageNo(+e)}
                >
                  {e}
                </Pagination.Item>
              );
            })}

            <Pagination.Next
              disabled={!hasNextPage}
              onClick={() => setPageNo(currentPage + 1)}
            />
            <Pagination.Last
              disabled={currentPage > totalPages - 2}
              onClick={() => setPageNo(totalPages)}
            />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomPagination;
