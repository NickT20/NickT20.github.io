import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ApiPlayer, PersonResponse } from "./types";
import { Button, List, ListItem, Stack, TextField } from "@mui/material";

interface ConfigPlayer extends ApiPlayer {
    name?: string,
}

function Config() {
    const [searchParams] = useSearchParams();
    const [showLoad, setShowLoad] = useState<boolean>(true);
    const [players, setPlayers] = useState<ConfigPlayer[]>([]);
    const navigate = useNavigate(); 

    // useEffect(() => {
    //     // declare the async data fetching function
    //     const fetchData = async () => {
    //       // get the data from the api
    //     //   const data = await fetch(`https://8kyrux6q4c.execute-api.us-east-1.amazonaws.com/players?teamId=${searchParams.get("teamId")}`);
    //       // convert the data to json
    //     //   const json = await data.json();
    //     const json = [
    //         {
    //             "farm": false,
    //             "teamId": 1,
    //             "starter": true,
    //             "order": 1,
    //             "playerId": "675911",
    //             "hitter": false
    //         },
    //         {
    //             "farm": false,
    //             "teamId": 1,
    //             "starter": true,
    //             "order": 3,
    //             "playerId": "676272",
    //             "hitter": false
    //         }
    //     ];
      
    //       // set state with the result
    //       setPlayers(json);
    //     }
      
    //     // call the function
    //     fetchData()
    //       // make sure to catch any error
    //       .catch(console.error);
    // }, [searchParams]);

    
    const handleLoad = async () => {
        setShowLoad(false);
        let url = "";
        
          // get the data from the api
          const data = await fetch(`https://8kyrux6q4c.execute-api.us-east-1.amazonaws.com/players?teamId=${searchParams.get("teamId")}`);
          // convert the data to json
          const json = await data.json();

// const json = [
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 20,
//         "playerId": "571656",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 4,
//         "playerId": "608841",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 2,
//         "playerId": "542194",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 10,
//         "playerId": "663362",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 15,
//         "playerId": "678894",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 3,
//         "playerId": "683003",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 15,
//         "playerId": "547973",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 1,
//         "playerId": "675911",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 16,
//         "playerId": "663432",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 4,
//         "playerId": "518876",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 7,
//         "playerId": "669394",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 1,
//         "playerId": "672515",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 12,
//         "playerId": "686668",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 12,
//         "playerId": "643511",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 19,
//         "playerId": "676395",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 14,
//         "playerId": "666971",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 8,
//         "playerId": "605204",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 21,
//         "playerId": "605452",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 16,
//         "playerId": "686894",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 2,
//         "playerId": "676272",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 13,
//         "playerId": "641584",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 11,
//         "playerId": "664854",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 9,
//         "playerId": "666277",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 14,
//         "playerId": "657240",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 17,
//         "playerId": "665795",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 5,
//         "playerId": "506433",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 9,
//         "playerId": "642731",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 17,
//         "playerId": "669003",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 3,
//         "playerId": "624413",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 5,
//         "playerId": "663898",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 19,
//         "playerId": "677942",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 6,
//         "playerId": "676701",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 6,
//         "playerId": "572020",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 11,
//         "playerId": "665862",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 18,
//         "playerId": "623149",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 10,
//         "playerId": "666134",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 13,
//         "playerId": "681911",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 18,
//         "playerId": "545121",
//         "hitter": true
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 8,
//         "playerId": "621381",
//         "hitter": false
//     },
//     {
//         "farm": false,
//         "teamId": 1,
//         "starter": true,
//         "order": 7,
//         "playerId": "666745",
//         "hitter": false
//     }
// ];

        json.sort((a: ApiPlayer, b: ApiPlayer) => a.order - b.order);

        
        const promises: Promise<void>[] = [];

        for (const player of json) {
            url = `https://statsapi.mlb.com/api/v1/people/${player.playerId}`;
            const p = fetch(url).then(async response => {
                if (response.ok) {
                    const personResponse: PersonResponse = await response.json();
                    player.name = personResponse.people[0].fullName;
                }
            } );
            promises.push(p)
        }
        await Promise.all(promises);
        setPlayers(json);
    }

    const handleOnChange = (playerId: string, order: number) => {
        setPlayers(players => {
            // Find the index of the object with the specified id
            const index = players.findIndex(item => item.playerId === playerId);
            
            // If the object is found
            if (index !== -1) {
              // Create a new array with the updated object
              const updatedItems = [...players];
              updatedItems[index] = { ...updatedItems[index], order: order };
              
              // Return the new state
              return updatedItems;
            }
            
            // If the object is not found, return the previous state
            return players;
          });
    }

    const handleSave = async () => {
        const playersToSend = players.filter(function (props) {
            delete props.name;
            return true;
        });
        while (playersToSend.length > 0) {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playersToSend.splice(0, 25))
            };
            await fetch('https://8kyrux6q4c.execute-api.us-east-1.amazonaws.com/players', requestOptions);
        }
        navigate('/');
    }

    const hittersDisplay = players.filter(p => p.hitter).map((player: ConfigPlayer) => 
        <ListItem key={player.playerId}>
            <TextField 
                size="small" 
                label="Order" 
                type="number" 
                value={player.order} 
                style = {{width: 100}}
                onChange={(event) => handleOnChange(player.playerId, +event.target.value)} /> - {player.name}
        </ListItem>)

    const pitchersDisplay = players.filter(p => !p.hitter).map((player: ConfigPlayer) => 
        <ListItem key={player.playerId}>
            <TextField 
                size="small" 
                label="Order" 
                type="number" 
                value={player.order} 
                style = {{width: 100}}
                onChange={(event) => handleOnChange(player.playerId, +event.target.value)} /> - {player.name}
        </ListItem>)

    return (<>
    
        <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/')}>
            Home
            </Button>
          <Button variant="contained" onClick={handleLoad} sx={{ display: !showLoad ? "none" : "block" }}>
            Load
          </Button>
          </Stack>
          <h2>Hitters</h2>
        <List>{hittersDisplay}</List>
        <hr />
          <h2>Pitchers</h2>
        <List>{pitchersDisplay}</List>
          <Button variant="contained" onClick={handleSave} sx={{ display: players.length === 0 ? "none" : "block" }}>
            Save
          </Button>
        </>)

}


export default Config