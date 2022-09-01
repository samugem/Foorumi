import {
  Typography,
  Stack,
  Button,
  Dialog,
  Card,
  CardActions,
  CardContent,
  Box,
  TextField,
  Alert,
} from "@mui/material";
import React, { useState, useRef } from "react";

const Registration = ({ handleClose, openRegistration }: any) => {
  const formRef = useRef<HTMLFormElement>();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const addNewUser = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formRef.current?.username.value && formRef.current?.password.value) {
      try {
        const connection = await fetch("/api/registration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formRef.current?.username.value,
            password: formRef.current?.password.value,
          }),
        });

        if (connection.status === 200) {
          setSuccessMsg(
            "Rekisteröityminen onnistui. Voit nyt kirjautua uudella tunnuksellasi"
          );
          setTimeout(function () {
            setSuccessMsg("");
            handleClose();
          }, 2000);
        } else if (connection.status === 403) {
          setErrorMsg("Käyttäjätunnus on jo varattu");
        } else {
          setErrorMsg("Rekisteröitymisessä tapahtui virhe");
        }
      } catch {
        setErrorMsg("Palvelimeen ei saada yhteyttä");
      }
    }
  };
  return (
    <Dialog onClose={() => handleClose()} open={openRegistration}>
      <Card sx={{ minWidth: 275 }}>
        <Box component="form" onSubmit={addNewUser} ref={formRef}>
          <CardContent>
            <Stack spacing={2}>
              <Typography textAlign="center">Rekisteröidy</Typography>
              <TextField id="username" label="Tunnus" required />
              <TextField id="password" label="Salasana" required />
            </Stack>
          </CardContent>
          {errorMsg ? <Alert severity="warning">{errorMsg}</Alert> : null}
          {successMsg ? <Alert>{successMsg}</Alert> : null}
          <CardActions>
            <Button type="submit" variant="contained">
              Rekisteröidy
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleClose()}
            >
              Peruuta
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Dialog>
  );
};
export default Registration;
