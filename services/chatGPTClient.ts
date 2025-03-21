// AnyGoodExpo/services/chatGPTClient.ts

// DTO Interfaces

export interface TelephoneInfoDTO {
  telephoneId: string;
  country: string;
  language: string;
}

export interface LoginRequestDTO {
  login: string;
  password: string;
}

// New InitialQuestionDTO used in the first question
export interface InitialQuestionDTO {
  initialQuery: string;
  selectedCountryCode: string;
  selectedLanguageCode: string;
}

// Updated GenerateQuestionRequestDTO for subsequent questions:
export interface GenerateQuestionRequestDTO {
  questionWithAnswers: QuestionWithAnswerDTO;
}

// The response from generateFirstQuestion is a QuestionWithAnswerDTO
export interface QuestionWithAnswerDTO {
  questionId: number;
  answers: string[];
}

// The response from generateNextQuestion is now a full QuestionDTO:
export interface QuestionDTO {
  questionId: number;
  text: string;
  options: string[];
  allowFreeText: boolean;
  last: boolean;
}

export interface ProductDTO {
  name: string;
  keyword: string;
  link: string;
  description: string;
}


//const API_BASE_URL = "http://10.0.2.2:8080"; 
const API_BASE_URL = "http://ec2-23-22-130-41.compute-1.amazonaws.com:8080"; 

// JWT token storage
let jwtToken: string | null = null;

function getHeaders(): HeadersInit {
  const headers: any = { "Content-Type": "application/json" };
  if (jwtToken) {
    headers["Authorization"] = `Bearer ${jwtToken}`;
  }
  return headers;
}

// 1. Login endpoint – Pass telephoneInfo in the body with query params username/test and password/test.
export async function login(telephoneInfo: TelephoneInfoDTO): Promise<any> {
  const queryParams = new URLSearchParams({ username: "test", password: "test" }).toString();
  const url = `${API_BASE_URL}/auth/login?${queryParams}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // No token needed for login
    body: JSON.stringify(telephoneInfo),
  });
  if (!response.ok) {
    throw new Error(`Login Error ${response.status}: ${await response.text()}`);
  }
  const data = await response.json();
  // Assuming backend returns token in data.token
  jwtToken = data.token;
  return data;
}

// 2. generateFirstQuestion endpoint: Called when the first question is asked.
export async function generateFirstQuestion(
  request: InitialQuestionDTO
): Promise<QuestionDTO> {
  const response = await fetch(`${API_BASE_URL}/api/generate_first_question`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Generate First Question Error ${response.status}: ${await response.text()}`);
  }
  return await response.json();
}

// 3. generateNextQuestion endpoint: Called when the user provides an answer.
//    Request now only contains questionWithAnswers; response returns a QuestionDTO.
export async function generateNextQuestion(
  request: GenerateQuestionRequestDTO
): Promise<QuestionDTO> {
  const response = await fetch(`${API_BASE_URL}/api/generate_next_question`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Generate Next Question Error ${response.status}: ${await response.text()}`);
  }
  return await response.json();
}

// In AnyGoodExpo/services/chatGPTClient.ts

export async function getProductRecommendations(
  request: GenerateQuestionRequestDTO
): Promise<ProductDTO[]> {
  const response = await fetch(`${API_BASE_URL}/api/get_product_recommendations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Get Product Recommendations Error ${response.status}: ${await response.text()}`);
  }
  const data = await response.json();
  // If data is an array, return it; if it's an object with a recommendations property, return that.
  if (Array.isArray(data)) {
    return data;
  } else if (data.recommendations && Array.isArray(data.recommendations)) {
    return data.recommendations;
  } else {
    return [];
  }
}

export async function getProductRecommendationsAdditional(
  request: GenerateQuestionRequestDTO
): Promise<ProductDTO[]> {
  const response = await fetch(`${API_BASE_URL}/api/get_product_recommendations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Get Additional Recommendations Error ${response.status}: ${await response.text()}`);
  }
  const data = await response.json();
  if (Array.isArray(data)) {
    return data;
  } else if (data.recommendations && Array.isArray(data.recommendations)) {
    return data.recommendations;
  } else {
    return [];
  }
}
