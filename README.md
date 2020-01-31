# BYOB / Cereals API

This API stores Cereal manufacturers and the cereals they produce.  It was created for my Mod 4 initial Solo Project in order to learn backend setup.

## Setup

* Clone down this repo and run `npm install`
* Run the server by using `npm start`

The server will run on `http://localhost:3001`. All endpoints are prefixed with `/api/v1`.

## Data Model

Manufacturers is returned as an object with the key of manufactueres.  The value of this is an array of manufacturer objects. Each object has these properties: `id`, `mfr`, `name`, `duration`, `created_at`, and `updated_at`.

```js
{
    "manufacturers": [
        {
            "id": 41,
            "mfr": "N",
            "name": "Nesquik",
            "created_at": "2020-01-30T04:34:30.655Z",
            "updated_at": "2020-01-30T04:34:30.655Z"
        },
```

Cereals is returned as an object with the key of cereals.  The value of this is an array of cereal objects. The object has these properties: `id`, `mfr`, `name`, `type, `calories`, `protein`, `fat`, `sodium`, `fiber`, `carbo`, `sugars`, `potass`, `vitamins`, `shelf`, `weight`, `cups`, `rating`, and `mfr_id`.

```js
{
  "cereals": [
      {
          "id": 1,
          "mfr": "N",
          "name": "100% Bran",
          "type": "C",
          "calories": 70,
          "protein": 4,
          "fat": 1,
          "sodium": 130,
          "fiber": 10,
          "carbo": 5,
          "sugars": 6,
          "potass": 280,
          "vitamins": 25,
          "shelf": 3,
          "weight": 1,
          "cups": "0",
          "rating": "68",
          "mfr_id": 41
      },
  ]
```

## Endpoints

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Get all manufacturers |`/api/v1/manufacturers`| GET | N/A | All manufacturers on the server: `[{}, {}, ...]` |
| Get specific manufacturer |`/api/v1/manufacturers/:id`| GET | N/A | Single manufacturer `[{}]` |
| Get all cereals |`/api/v1/cereals`| GET | N/A | All cereals on the server: `[{}, {}, ...]` |
| Get specific cereal |`/api/v1/cereals/:id`| GET | N/A | Single cereal `[{}]` |
| Post new manufacturer |`/api/v1/manufacturers`| POST | `{mfr: <string>, name: <string>}`| id of posted manufacturer: `<integer>` |
| Post new cereal |`/api/v1/cereals`| POST | `{mfr: <string>, name: <string>, type: <string>, calories: <integer>, protein: <integer>, fat: <integer>, sodium: <integer>, fiber: <integer>, carbo: <integer>, sugars: <integer>, potass: <integer>, vitamins: <integer>, shelf: <integer>, weight: <integer>, cups: <decimal>, rating: <decimal>, mfr_id: <integer>}`| id of posted cereal: `<integer>` |
| Delete specific cereal |`/api/v1/cereals/:id`| DEL | N/A| `204 - No Content` |
