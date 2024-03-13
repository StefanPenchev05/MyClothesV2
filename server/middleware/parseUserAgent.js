import useragent from "useragent";

// Middleware to parse User-Agent
export default function parseUserAgent(req, res, next) {
  // Get the user's IP address
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  //Parse the User-Agent string
  const agent = useragent.parse(req.headers["user-agent"]);
  const userAgent = agent.toString(); // Full user-agent string
  const browser = agent.toAgent(); // Browser name and version
  const operatingSystem = agent.os.toString(); // Operating system name and version
  let deviceType = agent.os.family; // Get the operating system from the parsed user agent

  // Check if the operating system matches any of the common mobile operating systems
  if (deviceType.match(/Android|iOS|Windows Phone/i)) {
    // If it does, set deviceType to "isMobile"
    deviceType = "isMobile";
  } else if (deviceType.match(/Windows NT|Mac OS X|Linux/i)) {
    // If it doesn't match mobile but matches common desktop operating systems, set deviceType to "isDesktop"
    deviceType = "isDesktop";
  } else {
    // If it doesn't match either mobile or desktop, set deviceType to "undefined"
    deviceType = "undefined";
  }

  req.userAgent = {
    userAgent,
    browser,
    operatingSystem,
    deviceType
  };

  next();
}
