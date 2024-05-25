# Skull king calculator
Works with mesh WebRTC with short term websocket for handshake.
websocket is terminated by host when game starts, and by joiner as soon as connection is created.

[Live Here](https://sks.games.jaeb.ae/)


# Connection overview

Miminize server involvement and cost by utilizing mesh RTC connections backed by minimal websocket connection for handshake.


## Steps
1. RoomID is websocket connection id
2. Websocket Server (SignalServer) is stateless
3. Host connects to ws, gets assigned id (roomid)
---
4. Joiner joins ws, ws server relays message to roomid (host)
---
5. Host creates new PeerConnection for joiner
6. Host creates Offer for joiner, and sets localDesriptor
7. Host sends Offer to Joiner through ws
---
8. Joiner receives offer
9. Joiner creates PeerConnection for Host and sets remoteDecriptor
10. Joiner creates answer and sets localDescripor
11. Joiner sends answer to host through ws
---
12. Host receives answer, sets remoteDescriptor
---
14. Host and Joiner starts creating icecandidates
15. icecandidates are sent to each other throuogh websocket
16. after few iterations, RTCConnection is established
---
17. After RTCConnection is established, joiner leaves ws channel
18. Host remains on the ws channel alone and waits for more joiners
19. Host notifies any existing joiners of the new joiner through RTC
20. Each of existing joiners connect to new joiner by repeating steps 6 - 16, but with Host as SignalServer relaying messages through RTC, instead of websocket. 
---
21. All members, including host and all joiners have RTC connection to all other members
22. When "Room (lobby) is closed", host leaves ws channel.
---
23. Ongoing communications are done through webRTC. Websocket is no longer needed.


## Total consumption of server (websocket)
Connection length

```
n + m
where n = duration of open lobby, m = nubmer of members
```

- Host : duration of lobby
- Each Joiner : 1-3 seconds

Messages
```
n
where n = number of members
```



# Known Issues (todos)
Connections
- Dropped connection handling
- Connection recovery through peers (if partially dropped)
- Message catchup when waked up
- Max time of lobby

Game 
- Total winnings should equal round
- Should not play game alone
