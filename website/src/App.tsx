import axios from "axios";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import "./App.css";

const BFF_BASE_URL = "http://localhost:3001";
const EXAMPLE_OWNER_ID = "example-owner-id";

type MyTeamsRequestBody = {
  ownerId: string;
  paging: { pageOffset: number; pageSize: number };
};

type MyTeamsResponseBody = {
  data: { id: string; name: string; ownerId: string }[];
  paging: { totalCount: number; pageSize: number; pageOffset: number };
};

function TeamsList(props: { ownerId: string }) {
  // State to store the fetched data
  const [data, setData] = useState<MyTeamsResponseBody>();

  // Function to fetch data using Axios
  const fetchData = async () => {
    try {
      const url = new URL("/v1/my/teams", BFF_BASE_URL).href;
      const response = await axios<MyTeamsRequestBody, MyTeamsResponseBody>({
        url,
        method: "GET",
        headers: {
          "X-Conversation-ID": v4(),
          "X-Request-ID": v4(),
        },
        data: {
          ownerId: EXAMPLE_OWNER_ID,
          paging: {
            pageOffset: 0,
            pageSize: 15,
          },
        },
      });
      // todo fix types
      const data: MyTeamsResponseBody =
        response.data as unknown as MyTeamsResponseBody;
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Teams:</h2>
      <ul>
        {data?.data?.map((team) => (
          <li key={team.id}>
            {team.id}: {team.name} (owner: {team.ownerId})
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const ownerId = "example-owner-id";
  return (
    <div className="App">
      <header className="App-header">
        <TeamsList ownerId={ownerId} />
      </header>
    </div>
  );
}

export default App;
