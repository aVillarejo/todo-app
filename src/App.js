import React from 'react'
import './App.css'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  TextField,
  Stack,
  FormControl,
} from '@mui/material'

// Icons
import DeleteIcon from '@mui/icons-material/Delete'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'

// Graphql
import { GET_ALL_TASKS } from './graphql/queries'
import { DELETE_TASK, CREATE_TASK, UPDATE_TASK } from './graphql/mutations'
import { useQuery, useMutation } from '@apollo/client'
import Loading from './components/Loading'

function App() {
  const [text, setText] = React.useState('')
  const { loading, error, data } = useQuery(GET_ALL_TASKS, {
    pollInterval: 500,
  })
  const [deleteTask] = useMutation(DELETE_TASK)
  const [updateTask] = useMutation(UPDATE_TASK)
  const [createTask] = useMutation(CREATE_TASK)

  if (loading) return <Loading />
  if (error) return <p>Error </p>

  // controls input text
  const handleChange = e => setText(e.target.value)

  // controls delete completed tasks
  const handleDeleteTask = id => {
    deleteTask({
      variables: { taskId: id },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    })
  }

  // Mark task as completed
  const handleUpdateTask = (id, description) => {
    updateTask({
      variables: {
        taskId: id,
        input: {
          description,
          status: 'COMPLETE',
        },
      },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    })
  }

  // Add new task
  const handleSubmit = e => {
    e.preventDefault()
    createTask({
      variables: {
        input: {
          description: text,
          status: 'ACTIVE',
        },
      },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    })
    setText('') // reset input text
  }
  return (
    <div className='app'>
      <header className='app-header'>
        <h1>TODO App</h1>
      </header>
      <main className='main-container'>
        <Grid item xs={12} md={6}>
          <FormControl>
            <Stack direction='row' spacing={1}>
              <TextField
                id='outlined-name'
                label='Task description'
                value={text}
                onChange={handleChange}
              />
              {text ? (
                <Button size='small' variant='contained' onClick={handleSubmit}>
                  <AddIcon fontSize='small' />
                </Button>
              ) : (
                <Button size='small' variant='contained' disabled>
                  <AddIcon fontSize='small' />
                </Button>
              )}
            </Stack>
          </FormControl>
          <Paper elevation={3}>
            <Typography sx={{ mt: 4, mb: 2 }} variant='h6' component='div'>
              Active Tasks
            </Typography>
            <List>
              {data.getAllTasks.map(
                ({ description, status, id }) =>
                  status === 'ACTIVE' && (
                    <ListItem
                      key={id}
                      secondaryAction={
                        <IconButton
                          edge='end'
                          aria-label='delete'
                          onClick={() => {
                            handleUpdateTask(id, description)
                          }}>
                          <CheckBoxOutlineBlankIcon />
                        </IconButton>
                      }>
                      <ListItemText primary={description} />
                    </ListItem>
                  )
              )}
            </List>
          </Paper>
          <br />
          <Paper elevation={3}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'>
                <Typography>Completed Tasks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {data.getAllTasks.map(
                    ({ description, status, id }) =>
                      status === 'COMPLETE' && (
                        <ListItem
                          key={id}
                          secondaryAction={
                            <IconButton
                              edge='end'
                              aria-label='delete'
                              onClick={() => handleDeleteTask(id)}>
                              <DeleteIcon color='error' />
                            </IconButton>
                          }>
                          <ListItemText primary={description} />
                        </ListItem>
                      )
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </main>
    </div>
  )
}

export default App
