import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import {
  Container,
  Text,
  Input,
  Button,
  ChakraProvider,
  Flex,
  Stack,
} from "@chakra-ui/react";

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000"); // Connect to the server
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("messages", (data) => {
      setMessages(data.messages);
    });

    return () => {
      newSocket.disconnect(); // Clean up the socket connection
    };
  }, []);

  const handleSendMessage = () => {
    socket.emit("newMessage", newMessage);
    setNewMessage("");
  };

  return (
    <ChakraProvider>
      <Container w="40%" pt={2}>
        <Flex>
          <Input
            placeholder="Your message"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
          />
          <Button ml={2} colorScheme="blue" onClick={handleSendMessage}>
            Send
          </Button>
        </Flex>
        <Stack spacing={3}>
          {messages.map((message, index) => (
            <Text key={index} fontSize="md">
              {message}
            </Text>
          ))}
        </Stack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
