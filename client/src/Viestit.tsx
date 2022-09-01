import {
  Typography,
  List,
  ListItemText,
  Stack,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
  Box,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Viesti {
  id: number;
  keskusteluId: number;
  nickname: string;
  content: string;
  timestamp: Date;
}
interface FetchSettings {
  method: string;
  headers?: any;
  body?: string;
}
interface ApiData {
  viestit: Viesti[];
  error: string;
  fetched: boolean;
}
const Viestit = () => {
  const [apiData, setApiData] = useState<ApiData>({
    viestit: [],
    error: "",
    fetched: false,
  });

  const formRef = useRef<HTMLFormElement>();
  const { id }: any = useParams();
  const location = useLocation();
  let keskustelu: any = location?.state;
  const [message, setMessage] = useState("");

  const addViesti = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (message) {
      const connection = await fetch("/api/viestit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keskusteluId: Number(id),
          nickname: formRef.current?.nickname.value || "anonyymi",
          content: message,
        }),
      });

      if (connection.status === 200) {
        apiCall();
        setMessage("");
        formRef.current?.reset();
      }
    }
  };

  const apiCall = async (method?: string): Promise<void> => {
    let settings: FetchSettings = {
      method: method || "GET",
    };

    try {
      const connection = await fetch(`/api/viestit/${id}`, settings);

      if (connection.status === 200) {
        const viestit = await connection.json();

        if (viestit.length > 0) {
          setApiData({
            ...apiData,
            error: "",
            viestit: viestit,
            fetched: true,
          });
        } else {
          setApiData({
            ...apiData,
            fetched: true,
          });
        }
      } else {
        let errorMsg: string = "";

        switch (connection.status) {
          default:
            errorMsg = "Palvelimella tapahtui odottamaton virhe";
            break;
        }
        setApiData({
          ...apiData,
          error: errorMsg,
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

  useEffect(() => {
    apiCall();
  }, []);

  return (
    <Stack sx={{ alignItems: "center", mt: 2 }}>
      <Typography variant="h5">{keskustelu?.header}</Typography>
      <Button component={Link} to={`/`} variant="outlined">
        Takaisin
      </Button>
      <List sx={{ width: "80%", maxWidth: "1300px", alignItems: "start" }}>
        <ListItem sx={{ background: "#D3D3D3", borderRadius: "16px" }}>
          <ListItemAvatar>
            <Avatar alt={keskustelu?.authorNickname} />
          </ListItemAvatar>
          <Stack>
            <ListItemText
              primary={keskustelu?.authorNickname}
              secondary={new Intl.DateTimeFormat("fi-FI", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date(keskustelu?.timestamp))}
              sx={{ wordWrap: "wrap" }}
            />
          </Stack>
          <ListItemText />
          <Typography
            sx={{
              width: "100%",
              borderRadius: "16px",
              border: "1px solid #D3D3D3",
              background: "#F5F5F5",
              p: 1,
              mb: 0,
            }}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: keskustelu?.content,
              }}
            />
          </Typography>
        </ListItem>
        {apiData.viestit.map((viesti: Viesti, idx: number) => {
          return (
            <ListItem key={idx}>
              <ListItemAvatar>
                <Avatar alt={viesti.nickname} />
              </ListItemAvatar>
              <Stack>
                <ListItemText
                  primary={viesti.nickname}
                  secondary={new Intl.DateTimeFormat("fi-FI", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(new Date(viesti.timestamp))}
                  sx={{ wordWrap: "wrap" }}
                />
              </Stack>
              <ListItemText />
              <Typography
                sx={{
                  width: "100%",
                  borderRadius: "16px",
                  border: "1px solid #D3D3D3",
                  p: 1,
                  mb: 0,
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: viesti?.content,
                  }}
                />
              </Typography>
            </ListItem>
          );
        })}
      </List>

      <Box
        component="form"
        onSubmit={addViesti}
        ref={formRef}
        sx={{ width: "80%", maxWidth: "1300px" }}
      >
        <Stack spacing={1}>
          <TextField
            id="nickname"
            multiline
            rows={1}
            label="Nimimerkki"
          ></TextField>

          <ReactQuill value={message} onChange={setMessage} />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Vastaa keskusteluun
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Viestit;
