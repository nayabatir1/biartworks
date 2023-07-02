import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import SideNavigaiton from "../../components/SideNavigaiton";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useGetReports } from "../../hooks/reports.hooks";
import CustomPagination from "../../components/Pagination";
import dayjs from "dayjs";
import debounce from "../../Utils/debounce";
import { Query } from "../../shared/types";
import useStore from "../../store/UserStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useGetDefectCount } from "../../hooks/defect-log";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const bounecer = debounce(1000);

const Reports = () => {
  const [spin, setSpin] = useState(false);
  const [search, setSearch] = useState("");

  const token = useStore((state) => state.token);

  const [query, setQuery] = useState<Query>({ page: 1, limit: 10 });

  const setPageNo = (page: number) => setQuery((p) => ({ ...p, page }));

  const { data, isLoading } = useGetReports(query);
  const { data: count } = useGetDefectCount();

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

  const handleStartDate = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value as unknown as Date;

    console.log({ date });

    setQuery((p) => ({
      ...p,
      startDate: dayjs(new Date(date)).startOf("date").toDate(),
    }));
  };

  const handleEndDate = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value as unknown as Date;
    setQuery((p) => ({
      ...p,
      endDate: dayjs(new Date(date)).endOf("date").toDate(),
    }));
  };

  const removeFilter = () => {
    setSearch("");
    setQuery((p) => {
      const temp = { ...p };
      delete temp.search;
      delete temp.startDate;
      delete temp.endDate;
      return temp;
    });
  };

  const download = useCallback(() => {
    setSpin(true);
    fetch(API_URL + "/api/reports/download", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        console.log(blob);

        // Create a URL for the downloaded file
        const downloadLink = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to initiate the download
        const link = document.createElement("a");
        link.href = downloadLink;
        link.setAttribute("download", "report.csv");

        // Simulate a click on the anchor element to trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSpin(false);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  }, [token]);

  return (
    <SideNavigaiton>
      <Container>
        <Row className="mt-1">
          <Col>
            <span className="h2 text-uppercase">reports</span>
            <Button className="float-end" onClick={removeFilter}>
              Clear all filter
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
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
          <Col xs={12} md={4} className="mt-2 mt-md-0">
            <Form.Group controlId="email">
              <Form.Control
                type="date"
                onChange={handleStartDate}
                value={
                  query.startDate
                    ? dayjs(query.startDate).format("YYYY-MM-DD")
                    : ""
                }
                className="border-0 border-bottom rounded-0"
              />
              <Form.Label>Start Date</Form.Label>
            </Form.Group>
          </Col>
          <Col xs={12} md={4} className="mt-2 mt-md-0">
            <Form.Group controlId="email">
              <Form.Control
                type="date"
                onChange={handleEndDate}
                value={
                  query.startDate
                    ? dayjs(query.endDate).format("YYYY-MM-DD")
                    : ""
                }
                className="border-0 border-bottom rounded-0"
                disabled={!query.startDate}
                min={
                  query.startDate
                    ? dayjs(query.startDate).format("YYYY-MM-DD")
                    : ""
                }
              />
              <Form.Label>End Date</Form.Label>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Button onClick={download} className="float-end" disabled={spin}>
              <span className="me-2">Download report </span>
              {spin ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faFileDownload} />
              )}
            </Button>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Part #</th>
                  <th>Defect</th>
                  <th>Date initiated</th>
                  <th>Status</th>
                  <th>Action taken for status change</th>
                  <th>Last status updated at</th>
                  <th>Last status updated by</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.docs.map((r) => (
                  <tr key={r.id}>
                    <td className="text-small">{r?.defect?.partNo}</td>
                    <td className="text-small">
                      {r?.defect?.defectType?.type}
                    </td>
                    <td className="text-small">
                      <p className="m-0">
                        {dayjs(r?.createdAt).format("DD MMM, YY")}
                      </p>
                      <p className="m-0">
                        {dayjs(r?.createdAt).format("h:m A")}
                      </p>
                    </td>
                    <td className={`text-small fw-bold ${r.status}`}>
                      {r?.status}
                    </td>
                    <td className="text-small">{r?.actionTaken}</td>
                    <td className="text-small">
                      <p className="m-0">
                        {dayjs(r.updatedAt).format("DD MMM, YY")}
                      </p>
                      <p className="m-0">
                        {dayjs(r.updatedAt).format("h:m A")}
                      </p>
                    </td>
                    <td className="text-small">{r?.updatedBy?.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {!isLoading && pagination && (
              <CustomPagination {...pagination} setPageNo={setPageNo} />
            )}
          </Col>
        </Row>
        <Row>
          {count?.data.map((i) => (
            <Col xs={12} md={4} key={i._id}>
              <p className="text-center fs-4 fw-semibold">{i.count}</p>
              <p className={`${i._id} fs-3 text-center fw-bold`}>{i._id}</p>
            </Col>
          ))}
        </Row>
      </Container>
    </SideNavigaiton>
  );
};

export default Reports;
