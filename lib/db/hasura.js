export async function insertStats(
  token,
  { favourited, userId, videoId, watched }
) {
  const operationsDoc = ` 
  mutation insertStats ($favourited: Int!, $userId: String!, $videoId: String!, $watched: Boolean!) {
    insert_Stats_one(object: {
      favourited: $favourited, 
      userId: $userId, 
      videoId: $videoId, 
      watched: $watched
    }) {
      favourited
      userId
    }
  }
`;

  return await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    { favourited, userId, videoId, watched },
    token
  );
}

export async function updateStats(
  token,
  { favourited, userId, videoId, watched }
) {
  const operationsDoc = `
  mutation updateStats ($favourited: Int!, $userId: String!, $videoId: String!, $watched: Boolean!) {
    update_Stats(
      _set: {watched: $watched, favourited: $favourited}, 
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) 
      {
      returning {
      favourited,
      userId,
      watched,
      videoId
      }
    }
  }
`;

  return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    { favourited, userId, videoId, watched },
    token
  );
}

export async function findVideoIdByUser(userId, videoId, token) {
  const operationsDoc = `
  query findVideoIdByUserId ($userId: String!, $videoId: String!) {
    Stats(where: {videoId: {_eq:  $videoId}, userId: {_eq: $userId}}) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    {
      userId,
      videoId,
    },
    token
  );
  return response?.data?.Stats;
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser ($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_Users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
        publicAddress
      }
    }
  }
`;

  const { issuer, publicAddress, email } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    { issuer, publicAddress, email },
    token
  );
  return response;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    Users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );
  return response?.data?.Users?.length === 0 ? true : false;
}

export async function getWatchedVideos(token, userId) {
  const operationsDoc = `
  query getWatchedVideos ($userId: String!) {
    Stats(where: {watched: {_eq: true}, 
      userId: {_eq: $userId}
    }) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "getWatchedVideos",
    {
      userId,
    },
    token
  );
  return response?.data?.Stats;
}

export async function getMyListVideos(token, userId) {
  const operationsDoc = `
  query getMyListVideos ($userId: String!) {
    Stats(where: {
      userId: {_eq: $userId}, 
      favourited: {_eq: 1}}) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "getMyListVideos",
    {
      userId,
    },
    token
  );
  return response?.data?.Stats;
}

export async function queryHasuraGQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables,
      operationName,
    }),
  });

  return await result.json();
}
