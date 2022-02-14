export const baseData = {
  nodes: [
    {
      id: "d8ab19c6-98d7-4e53-b6c5-ee895b07c635",
      type: "sql-node",
      x: 200,
      y: 200,
      properties: {
        tableName: "Users",
        fields: [
          {
            id: "405ad52d-6340-4405-8a7e-b27d40d34bf9",
            indexType: "index",
            name: "id",
            type: "string",
            nullable: true
          },
          {
            id: "5a057d2b-d766-4a8e-bc4f-60824a95f0bf",
            indexType: "unique",
            name: "name",
            type: "string",
            nullable: false
          },
          {
            id: "53485533-e88c-4a68-8150-cd26bc83188d",
            indexType: "primary",
            name: "age",
            type: "integer",
            nullable: false
          },
          {
            id: "6a920758-0117-4056-b9b7-c35ba24ce43d",
            indexType: "none",
            name: "job",
            type: "string",
            nullable: true
          }
        ]
      }
    },
    {
      id: "acb8a363-c23b-437f-a69b-03c39ea05579",
      type: "sql-node",
      x: 600,
      y: 200,
      properties: {
        tableName: "Settings",
        fields: [
          {
            id: "00982258-6bc8-4e5c-bc69-658d86e06ae4",
            indexType: "primary",
            name: "id",
            type: "string",
            nullable: true
          },
          {
            id: "48614117-7616-446a-b236-4a9bf4e4c9b1",
            indexType: "none",
            name: "key",
            type: "integer",
            nullable: false
          },
          {
            id: "4885d377-425f-4606-888c-be3c7d2e061b",
            indexType: "none",
            name: "some_really",
            type: "string",
            nullable: false
          }
        ]
      }
    }
  ],
  edges: []
};
