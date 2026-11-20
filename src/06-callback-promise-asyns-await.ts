type User = {
  id: number;
  name: string;
  role: "user" | "super-admin";
};

const user: User[] = [
  { id: 1, name: "Junaid", role: "user" },
  { id: 2, name: "Ali", role: "super-admin" },
  { id: 3, name: "Ahmed", role: "user" },
];

//callback is a funtion that is  to be passed as an argument to another function

function findUserWithCallback(
  userId: number,
  callback: (error: Error | null, user?: User) => void,
): void {
  setTimeout(() => {
    const userFound = user.find((user) => user.id === userId);
    if (!userFound) {
      callback(new Error("User not found"));
    }
    callback(null, userFound);
  });
}

function handelUserResponse( error, user ) {
    if (error) { 
        console.error(error.message);

    } else {
        console.log(user,"dsfsdf");
    }       
}

findUserWithCallback(9, handelUserResponse);