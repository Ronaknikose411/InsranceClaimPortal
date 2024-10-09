// Get references to DOM elements
const claimSubmissionSection = document.getElementById("claimSubmission");
const claimStatusSection = document.getElementById("claimStatus");
const knowledgeBaseSection = document.getElementById("knowledgeBase");
const chatbotSection = document.getElementById("chatbot");
const claimForm = document.getElementById("claimForm");
const submissionMessage = document.getElementById("submissionMessage");
const claimsTable = document.getElementById("claimsTable");
const searchClaimNumber = document.getElementById("searchClaimNumber");
const searchClaimBtn = document.getElementById("searchClaimBtn");
const searchResultMessage = document.getElementById("searchResultMessage");
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendMessage = document.getElementById("sendMessage");

let claims = []; // Store all claims

// Utility function to hide all sections
function hideAllSections() {
  claimSubmissionSection.classList.add("hidden");
  claimStatusSection.classList.add("hidden");
  knowledgeBaseSection.classList.add("hidden");
  chatbotSection.classList.add("hidden");
}

// Event Listeners for Navigation Buttons
document.getElementById("fileClaimBtn").addEventListener("click", () => {
  hideAllSections();
  claimSubmissionSection.classList.remove("hidden");
});

document.getElementById("trackClaimsBtn").addEventListener("click", () => {
  hideAllSections();
  claimStatusSection.classList.remove("hidden");
});

document.getElementById("inspolicyBtn").addEventListener("click", () => {
  hideAllSections();
  knowledgeBaseSection.classList.remove("hidden");
});

document.getElementById("chatbotBtn").addEventListener("click", () => {
  hideAllSections();
  chatbotSection.classList.remove("hidden");
});

// Claim Submission Form Handling
claimForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const policyNumber = document.getElementById("policyNumber").value;
  const incidentDate = document.getElementById("incidentDate").value;
  const incidentDescription = document.getElementById(
    "incidentDescription"
  ).value;
  const claimType = document.getElementById("claimType").value;

  // Form validation
  if (!policyNumber || !claimType || !incidentDate || !incidentDescription) {
    submissionMessage.innerText = "Please fill in all required fields.";
    submissionMessage.classList.remove("hidden");
    return;
  }

  // Generate a unique claim number based on the claim type
  const claimCode = getClaimCode(claimType);
  const claimNumber = `INS${claimCode}${claims.length + 1}`;

  // Disable submit button during submission
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  // Add the new claim to the claims array
  claims.push({
    claimNumber: claimNumber,
    policyNumber: policyNumber,
    claimType: claimType,
    incidentDate: incidentDate,
    status: "Pending",
    description: incidentDescription,
    dateSubmitted: new Date().toLocaleDateString(),
    position: getPositionForClaim(), // Assign a position to the claim
  });

  // Display success message with the claim number
  submissionMessage.innerText = `Claim submitted successfully! Your claim number is ${claimNumber}.`;
  submissionMessage.classList.remove("hidden");
  submitButton.disabled = false;
  claimForm.reset();
  // Update claims table after submission
});

// Function to get claim code based on the type
function getClaimCode(claimType) {
  switch (claimType) {
    case "Health":
      return "HL11";
    case "Auto":
      return "AU22";
    case "Home":
      return "HM33";
    case "Travel":
      return "TR44";
    case "Life":
      return "LF55";
    case "Liability":
      return "LB66";
    default:
      return "";
  }
}

// Function to determine position handling the claim
function getPositionForClaim() {
  const positions = ["Process Associate", "Quality Associate", "Manager"];
  // Randomly assign one of the positions for simulation
  return positions[Math.floor(Math.random() * positions.length)];
}

// Function to update the claims table
function updateClaimsTable() {
  const tbody = claimsTable.getElementsByTagName("tbody")[0];
  tbody.innerHTML = ""; // Clear existing rows

  if (claims.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No recent claims found.</td></tr>';
  } else {
    claims.forEach((claim) => {
      const row = tbody.insertRow();
      row.insertCell(0).innerText = claim.claimNumber;
      row.insertCell(1).innerText = claim.policyNumber; // Display the policy number
      row.insertCell(2).innerText = claim.claimType; // Display the claim type
      row.insertCell(3).innerText = claim.status;
      row.insertCell(4).innerText = claim.position; // Display the position working on the claim
      row.insertCell(5).innerText = claim.dateSubmitted;
    });
  }
}

// Search for Claim Status
searchClaimBtn.addEventListener("click", () => {
  const claimNumber = searchClaimNumber.value.trim();
  const foundClaim = claims.find((claim) => claim.claimNumber === claimNumber);

  // Reset table visibility
  claimsTable.classList.add("hidden"); // Hide the claims table initially

  // Reset the search result message visibility
  searchResultMessage.classList.add("hidden"); // Hide the result message initially

  if (foundClaim) {
    // Show the claims table if a claim is found
    claimsTable.classList.remove("hidden");
    updateClaimsTable(); // Ensure the table is updated with relevant claims
  } else {
    searchResultMessage.innerText = `No claim found with number: ${claimNumber}`;
    searchResultMessage.classList.remove("hidden");
  }

  // Reset the search input after searching
  searchClaimNumber.value = "";
  // Update claims table after submission
});

// Get references to DOM elements
const policyTypeDropdown = document.getElementById("policyType");
const policyDetailsContainer = document.getElementById(
  "policyDetailsContainer"
);
const downloadSection = document.getElementById("downloadSection");
const downloadPolicyBtn = document.getElementById("downloadPolicyBtn");

// Insurance policy details object
const policyDetails = {
  Health:
    "Health insurance covers medical expenses, including hospitalization, surgeries, and medications.",
  Auto: "Auto insurance provides coverage for vehicle damage, theft, and third-party liability in case of accidents.",
  Home: "Home insurance protects against damages to your home and its contents due to fire, theft, and natural disasters.",
  Travel:
    "Travel insurance covers trip cancellations, lost luggage, medical emergencies, and other travel-related incidents.",
  Life: "Life insurance provides a payout to beneficiaries in the event of the policyholder’s death.",
  Liability:
    "Liability insurance covers legal expenses and claims if you are held responsible for injuries or damages to another person or property.",
};

// Mapping policy types to their corresponding PDF filenames
const policyPDFs = {
  Health: "assets/HealthPolicy.pdf",
  Auto: "assets/AutoPolicy.pdf",
  Home: "assets/HomePolicy.pdf",
  Travel: "assets/TravelPolicy.pdf",
  Life: "assets/LifePolicy.pdf",
  Liability: "assets/LiabilityPolicy.pdf",
};

// Function to display selected policy details and enable PDF download
function displayPolicyDetails(policyType) {
  if (policyType in policyDetails) {
    policyDetailsContainer.innerHTML = `<p>${policyDetails[policyType]}</p>`;
    downloadSection.classList.remove("hidden");

    // Update the download button with the correct PDF file link
    downloadPolicyBtn.onclick = function () {
      const pdfFile = policyPDFs[policyType];
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = `${policyType}Policy.pdf`; // Set the download name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  } else {
    policyDetailsContainer.innerHTML =
      "<p>No details available for the selected policy.</p>";
    downloadSection.classList.add("hidden");
  }
}

// Listen for policy type selection changes
policyTypeDropdown.addEventListener("change", (event) => {
  const selectedPolicy = event.target.value;
  displayPolicyDetails(selectedPolicy);
});

// Chatbot Interaction// Event listener for sending messages in the chatbot
document.getElementById("sendMessage").addEventListener("click", () => {
  const userInput = document.getElementById("userInput").value;

  if (userInput.trim() === "") return; // Don't send empty messages

  addMessageToChat("User", userInput); // Show user message in chat
  document.getElementById("userInput").value = ""; // Clear input field

  // Simulate response from the chatbot
  getBotResponse(userInput);
});

// Function to add messages to the chat
function addMessageToChat(sender, message) {
  const chatMessages = document.getElementById("chatMessages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatMessages.appendChild(messageElement);

  // Auto scroll to the latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to simulate chatbot response
function getBotResponse(userInput) {
  const botResponses = {
    "how do i file a claim?":
      "You can file a claim by visiting our claims page.",
    "what’s my claim status?":
      "Please enter your Claim Number or Policy Number.",
    "what documents do i need?":
      "To file a claim, you typically need your policy number, claim form, and relevant receipts.",
  };

  // Extract claim number and policy number from user input
  const claimNumber = extractClaimNumber(userInput);
  const policyNumber = extractPolicyNumber(userInput);

  // Check for extracted claim or policy number
  if (claimNumber) {
    const response = getClaimStatus(claimNumber);
    setTimeout(() => {
      addMessageToChat("Bot", response); // Show bot response after delay
    }, 1000);
  } else if (policyNumber) {
    const response = getClaimNumberByPolicy(policyNumber);
    setTimeout(() => {
      addMessageToChat("Bot", response); // Show bot response after delay
    }, 1000);
  } else {
    // If no valid input is found, respond with predefined messages
    const response =
      botResponses[userInput.toLowerCase()] ||
      "I am sorry, I didn't understand that. Please ask another question.";
    setTimeout(() => {
      addMessageToChat("Bot", response); // Show bot response after delay
    }, 1000); // Delay for realism
  }
}

// Function to get claim status by claim number
function getClaimStatus(claimNumber) {
  const foundClaim = claims.find(
    (claim) => claim.claimNumber.toLowerCase() === claimNumber.toLowerCase()
  );
  if (foundClaim) {
    return `Your claim status is: ${foundClaim.status}. Claim Number: ${foundClaim.claimNumber}, Policy Number: ${foundClaim.policyNumber}.`;
  } else {
    return `No claim found with the number: ${claimNumber}. Please check the number and try again.`;
  }
}
// Function to get claim number by policy number
function getClaimNumberByPolicy(policyNumber) {
  // Make sure to check both numbers in a case-insensitive manner
  const foundClaim = claims.find(
    (claim) =>
      claim.policyNumber.toString().toLowerCase() ===
      policyNumber.toString().toLowerCase()
  );

  if (foundClaim) {
    return `You have applied for a claim. As per Policy Number ${policyNumber}, your Claim Number is: ${foundClaim.claimNumber}. Claim Status: ${foundClaim.status}.`;
  } else {
    return `No claims found for the policy number: ${policyNumber}. Please apply for Claim and try again.`;
  }
}

// Helper function to extract claim number from user input
function extractClaimNumber(message) {
  // Logic to extract claim number from the message
  return message.match(/\b[A-Z0-9]+\b/)
    ? message.match(/\b[A-Z0-9]+\b/)[0]
    : null; // Return the first alphanumeric word found
}

// Helper function to extract policy number from user input
function extractPolicyNumber(message) {
  // Allow both uppercase and lowercase letters in the policy number
  const regex = /\b[a-zA-Z]{2}\d{4}[a-zA-Z]?\b/; // Example: Format might be AA1234 or Aa1234a
  const match = message.match(regex);
  return match ? match[0] : null; // Return the matched policy number or null if not found
}
