import * as React from 'react'
import PropTypes from 'prop-types'
import {
  TextField,
  Autocomplete,
  CircularProgress,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import useBoardTags from '../../api/useBoardTags'


function AddTagSelect(props) {
  const { boardId } = useParams()
  const { data: tags, isLoading, isError } = useBoardTags(boardId)
  const [open, setOpen] = React.useState(true)
  const [tagsToAdd, setTagsToAdd] = React.useState([])

  React.useEffect(() => {
    if (!tags) return

    const addedTagsIds = Object.fromEntries(props.addedTags.map((tag) => [tag.id, true]))
    const newTagsToAdd = tags.filter((tag) => !Object.prototype.hasOwnProperty.call(addedTagsIds, tag.id))
    setTagsToAdd(newTagsToAdd)
  }, [tags, props.addedTags])

  return (
    <Autocomplete
      id='assign-user-to-task-select'
      open={open}
      onChange={props.onChange}
      onOpen={() => setOpen(true) }
      onClose={() => setOpen(false) }
      onBlur={props.onBlur}
      isOptionEqualToValue={(option, other) => option.id === other.id}
      getOptionLabel={(option) => option.name}
      options={tagsToAdd}
      loading={isLoading || isError}
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
    />
  )
}

AddTagSelect.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  addedTags: PropTypes.arrayOf(PropTypes.object)
}

export default AddTagSelect
