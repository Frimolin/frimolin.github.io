export async function fetchData(endpoint){
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data;
    }
    catch (error){
        console.error('Error fetching data:', error)
    }
}

export async function postData(endpoint, data) {  //aller donner des données
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
}

export async function fetchCookie(endpoint) {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw the error for higher-level handling
  }
}