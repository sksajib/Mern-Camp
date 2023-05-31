import { Avatar } from "antd";
const ActiveFriends = ({ active }) => {
  console.log(active);
  return (
    <div
      style={{ height: "50px", overflow: "scroll" }}
      className="scrollbar d-flex justify-content-start "
    >
      {active !== null &&
        active.length > 0 &&
        active.map((person) => (
          <div key={person._id} className="overflow-hidden">
            <div className="activeAvatar d-inline z-2 position-relative">
              {!person.photo ? (
                <Avatar size={40} className="mt-1 ms-1">
                  {person.name.charAt(0)}
                </Avatar>
              ) : (
                <Avatar src={person.photo} size={40} className="mt-1 ms-1" />
              )}
            </div>
            <div
              style={{
                height: "8px",
                width: "8px",
                backgroundColor: "green",
                borderRadius: "50%",

                display: "inline-block",
              }}
              className="activeDot z-3 position-relative"
            ></div>
          </div>
        ))}
      {active == null && <h4>No One is Active</h4>}
    </div>
  );
};
export default ActiveFriends;
