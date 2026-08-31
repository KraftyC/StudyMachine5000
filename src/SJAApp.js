import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import Header from "./components/header";

export default function SJAApp() {
  return (
    <div className="text-white">
      <Header />
      <Container style={{ maxWidth: "768px" }}>
        <div className="px-3">
          Test
        </div>
      </Container>
    </div>
  );
}