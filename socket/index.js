// port
const io = require("socket.io")(8900, {
  // cors
  cors: {
    origin: "http://localhost:3000",
  },
});

// onlineUsers
let onlineUsers = [];

// function of addUser
const addUser = (userID, socketID) => {
  if (onlineUsers.some((user) => user.userID === userID) === false) {
    onlineUsers.push({ userID, socketID });
  }
  console.log("add user");
  console.log(onlineUsers);
};

// function of removeuser
const removeuser = (socketID) => {
  onlineUsers = onlineUsers.filter((user) => user.socketID !== socketID);
};

// function of getUser
const getUser = (receiverID) => {
  return onlineUsers.find((user) => user.userID === receiverID);
};

// when someone connection
io.on("connection", (socket) => {
  console.log("a user connected.");
  // addUser take userID and socketID from user
  socket.on("addUser", (userID) => {
    addUser(userID, socket.id);
    // getUsers
    io.emit("getUsers", onlineUsers);
  });

  // send and get message
  socket.on("sendMessage", ({ senderID, receiverID, text, image }) => {
    const user = getUser(receiverID);
    if (user) {
      io.to(user.socketID).emit("getMessage", {
        senderID,
        text,
        image,
      });
    }
  });

  // send and get notification
  socket.on(
    "sendNotification",
    ({ senderID, receiverID, notificationType, postNotificationType }) => {
      const user = getUser(receiverID);
      if (user) {
        io.to(user.socketID).emit("getNotification", {
          senderID,
          notificationType,
          postNotificationType,
        });
        console.log("get");
      }
      console.log("send");
    }
  );

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeuser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});
