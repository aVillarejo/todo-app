import {
  gql
} from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
  createTask(input: $input) {
    description
    status
  }
}
`;
export const UPDATE_TASK = gql`
  mutation UpdateTask($input: TaskInput!, $taskId: ID!) {
  updateTask(input: $input, id: $taskId) {
    id
    description
    status
  }
}
`;
export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(id: $taskId)
  }
`;