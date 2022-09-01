import {
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
  List,
  Stack,
  ListItem,
  Button,
  Box,
  TextField,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Keskustelu {
  id: number;
  header: number;
  authorNickname: string;
  content: string;
  timestamp: Date;
  updatedAt: Date;
  _count: any;
}
interface ApiData {
  keskustelut: Keskustelu[];
  error: string;
  fetched: boolean;
}
interface FetchSettings {
  method: string;
  headers?: any;
  body?: string;
}

const Main: React.FC = (): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    keskustelut: [],
    error: "",
    fetched: false,
  });
  const formRef = useRef<HTMLFormElement>();
  const [message, setMessage] = useState("");
  const apiCall = async (method?: string): Promise<void> => {
    let settings: FetchSettings = {
      method: method || "GET",
    };

    try {
      const connection = await fetch("/api/keskustelut", settings);

      if (connection.status === 200) {
        const keskustelut = await connection.json();

        if (keskustelut.length < 1) {
          setApiData({
            ...apiData,
            error: "Ei viestejä",
            fetched: true,
          });
        } else {
          setApiData({
            ...apiData,
            error: "",
            keskustelut: keskustelut,
            fetched: true,
          });
        }
      } else {
        setApiData({
          ...apiData,
          error: "Palvelimella tapahtui odottamaton virhe",
          fetched: true,
        });
      }
    } catch (e: any) {
      setApiData({
        ...apiData,
        error: "Palvelimeen ei saada yhteyttä",
        fetched: true,
      });
    }
  };

  const addViesti = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (message) {
      const connection = await fetch("/api/keskustelut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorNickname: formRef.current?.nickname.value || "anonyymi",
          content: message,
          header: formRef.current?.header.value,
        }),
      });

      if (connection.status === 200) {
        apiCall();
        setMessage("");
        formRef.current?.reset();
      }
    }
  };
  useEffect(() => {
    apiCall();
  }, []);

  return (
    <Stack sx={{ alignItems: "center" }}>
      {Boolean(apiData.error) ? (
        <Alert severity="error">{apiData.error}</Alert>
      ) : apiData.fetched ? (
        <List sx={{ width: "100%", maxWidth: "1300px" }}>
          {apiData.keskustelut.map((keskustelu: Keskustelu, idx: number) => {
            return (
              <ListItem
                key={idx}
                sx={{
                  borderBottom: "solid 1px grey",
                }}
              >
                <Box
                  sx={{
                    minWidth: "70%",
                  }}
                >
                  <Stack>
                    <Typography
                      sx={{
                        width: "100%",

                        p: 1,
                        mb: 0,
                        color: "black",
                        textDecoration: "none",
                      }}
                      variant="h4"
                      component={Link}
                      to={`/${keskustelu.id}`}
                      state={keskustelu}
                    >
                      {keskustelu?.header}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    ml: 5,
                    maxWidth: "20%",
                    display: "flex",
                    contentAlign: "end",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar alt={keskustelu?.authorNickname} />
                  </ListItemAvatar>
                  <Stack>
                    <ListItemText
                      primary={keskustelu?.authorNickname}
                      secondary={`Luotu: ${new Intl.DateTimeFormat("fi-FI", {
                        dateStyle: "full",
                        timeStyle: "short",
                      }).format(new Date(keskustelu?.timestamp))}`}
                      sx={{ wordWrap: "wrap" }}
                    />
                    <ListItemText
                      secondary={`Uusin viesti: ${new Intl.DateTimeFormat(
                        "fi-FI",
                        {
                          dateStyle: "full",
                          timeStyle: "short",
                        }
                      ).format(new Date(keskustelu?.updatedAt))}`}
                      sx={{ wordWrap: "wrap" }}
                      primary={`Vastauksia: ${keskustelu?._count.viestit}`}
                    />
                  </Stack>
                </Box>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box
        component="form"
        onSubmit={addViesti}
        ref={formRef}
        sx={{ width: "80%", maxWidth: "1300px" }}
      >
        <Stack spacing={1}>
          <TextField id="nickname" label="Nimimerkki"></TextField>
          <TextField id="header" rows={1} label="Otsikko" required></TextField>
          <ReactQuill value={message} onChange={setMessage} />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Aloita uusi keskustelu
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Main;
