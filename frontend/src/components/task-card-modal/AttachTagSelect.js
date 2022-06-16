import * as React from 'react'
import PropTypes from 'prop-types'
import {
  TextField,
  Autocomplete,
  CircularProgress,
  createFilterOptions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import ColorPickerPopover from '../ColorPickerPopover'
import useBoardTags from '../../api/useBoardTags'
import lambdeeTheme from '../../lambdeeTheme'

const filter = createFilterOptions()


function AttachTagSelect(props) {
  const { boardId } = useParams()
  const { data: tags, isLoading, isError } = useBoardTags(boardId)
  const [openTagsPopup, setTagsPopup] = React.useState(true)
  const [openNewTagDial, setNewTagDial] = React.useState(false)
  const [tagsToAdd, setTagsToAdd] = React.useState([])
  const [newCreatedTag, setNewCreatedTag] = React.useState({
    name: '',
    colour: '#1082F3',
  })

  React.useEffect(() => {
    if (!tags) return

    const addedTagsIds = Object.fromEntries(props.addedTags.map((tag) => [tag.id, true]))
    const newTagsToAdd = tags.filter((tag) => !Object.prototype.hasOwnProperty.call(addedTagsIds, tag.id))
    setTagsToAdd(newTagsToAdd)
  }, [tags, props.addedTags])


  const handleClose = () => {
    setNewCreatedTag({
      name: '',
      colour: '#1082F3',
    })
    setNewTagDial(false)
    props.onBlur()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    props.createTag(newCreatedTag)
    handleClose()
    props.onBlur()
  }


  return (
    <div>
      <Autocomplete
        id='attach-tag-to-task-select'
        options={tagsToAdd}
        loading={isLoading || isError}
        isOptionEqualToValue={(option, other) => option.id === other.id}
        open={openTagsPopup}
        onOpen={() => setTagsPopup(true) }
        onClose={() => setTagsPopup(false) }
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        freeSolo
        onChange={(event, newValue, reason) => {
          if (typeof newValue === 'string') {
            setTimeout(() => {
              setTagsPopup(false)
              setNewTagDial(true)
              setNewCreatedTag({
                ...newCreatedTag,
                name: newValue,
              })
            })
          } else if (newValue && newValue.inputValue) {
            setTagsPopup(false)
            setNewTagDial(true)
            setNewCreatedTag({
              ...newCreatedTag,
              name: newValue.inputValue,
            })
          } else  {
            props.onChange(event, newValue)
          }
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option
          }
          if (option.inputValue) {
            return option.inputValue
          }
          return option.name
        }}
        renderOption={(params, option) => (
          <li {...params} key={option.name + option.id || option.name }>
            <div
              style={{ width: '16px',
                height: '16px',
                borderRadius: '3px',
                marginRight: '4px',
                backgroundColor: option.colour || 'transparent' }}
            />
            <div
              style={option.toCreate ?
                { color: lambdeeTheme.palette.primary.main, } : {}}>
              {option.name}
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Add tag'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading || isError ? <CircularProgress color='inherit' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}

          />
        )}
        filterOptions={(options, params) => {
          const filtered = filter(options, params)
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              name: `Create "${params.inputValue}"`,
              toCreate: true
            })
          }
          return filtered
        }}

      />
      <Dialog open={openNewTagDial} onClose={handleClose} >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create new tag</DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexFlow: 'row',
              alignItems: 'end'
            }}>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              value={newCreatedTag.name}
              onChange={(event) => setNewCreatedTag({
                ...newCreatedTag,
                name: event.target.value,
              })}
              label='Tag Name'
              type='text'
              variant='standard'
            />
            <ColorPickerPopover
              width={32}
              height={32}
              color={newCreatedTag.colour}
              onChange={(newColour) => setNewCreatedTag({
                ...newCreatedTag,
                colour: newColour,
              })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit'>Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>

  )
}

AttachTagSelect.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  createTag: PropTypes.func,
  addedTags: PropTypes.arrayOf(PropTypes.object)
}

export default AttachTagSelect
