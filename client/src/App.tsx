import React from "react";
import "./App.css";
import Main from "./Main";
import Viestit from "./Viestit";
import { Route, Routes } from "react-router-dom";
import { Typography, Container } from "@mui/material";

const App: React.FC = (): React.ReactElement => {
  return (
    <Container>
      <Typography variant="h4" textAlign="center">
        Foorumi
      </Typography>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:id" element={<Viestit />} />
      </Routes>
    </Container>
  );
};

export default App;
