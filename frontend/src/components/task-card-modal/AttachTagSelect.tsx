import * as React from 'react'
import { useParams } from 'react-router-dom'

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

import lambdeeTheme from '../../lambdee-theme'
import useBoardTags from '../../api/board-tags'
import type { TagShort } from '../../types'

import ColorPickerPopover from '../ColorPickerPopover'

const filter = createFilterOptions<TagShort & { inputValue?: string; toCreate?: boolean }>()

interface NewTag {
  name: string
  colour: string
}

interface Props {
  onBlur?: () => void
  onChange?: (event: React.SyntheticEvent, value: TagShort | null) => void
  createTag?: (tag: NewTag) => void
  addedTags?: TagShort[]
  boardId?: string | number
}

function AttachTagSelect({ onBlur, onChange, createTag, addedTags = [], boardId }: Props) {
  const { data: tags, isLoading, isError } = useBoardTags({ id: boardId })
  const [openTagsPopup, setTagsPopup] = React.useState(true)
  const [openNewTagDial, setNewTagDial] = React.useState(false)
  const [tagsToAdd, setTagsToAdd] = React.useState<TagShort[]>([])
  const [newCreatedTag, setNewCreatedTag] = React.useState<NewTag>({
    name: '',
    colour: '#1082F3',
  })

  React.useEffect(() => {
    if (!tags) return

    const addedTagsIds = Object.fromEntries(addedTags.map((tag) => [tag.id, true]))
    const newTagsToAdd = tags.filter((tag) => !Object.prototype.hasOwnProperty.call(addedTagsIds, tag.id))
    setTagsToAdd(newTagsToAdd)
  }, [tags, addedTags])


  const handleClose = () => {
    setNewCreatedTag({
      name: '',
      colour: '#1082F3',
    })
    setNewTagDial(false)
    onBlur?.()
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createTag?.(newCreatedTag)
    handleClose()
    onBlur?.()
  }


  return (
    <div>
      <Autocomplete
        id='attach-tag-to-task-select'
        options={tagsToAdd}
        loading={isLoading || isError}
        isOptionEqualToValue={(option, other) => typeof option !== 'string' && typeof other !== 'string' && option.id === other.id}
        open={openTagsPopup}
        onOpen={() => setTagsPopup(true) }
        onClose={() => setTagsPopup(false) }
        onBlur={openNewTagDial ? undefined : onBlur}
        selectOnFocus
        clearOnEscape
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
          } else if (newValue && (newValue as { inputValue?: string }).inputValue) {
            setTagsPopup(false)
            setNewTagDial(true)
            setNewCreatedTag({
              ...newCreatedTag,
              name: (newValue as unknown as { inputValue: string }).inputValue,
            })
          } else  {
            onChange?.(event, newValue as TagShort | null)
          }
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option
          }
          if ((option as unknown as { inputValue?: string }).inputValue) {
            return (option as unknown as { inputValue: string }).inputValue
          }
          return option.name
        }}
        renderOption={({ key, ...params }, option) => (
          <li key={key ?? (typeof option === 'string' ? option : (option.name + option.id || option.name))} {...params}>
            <div
              style={{ width: '16px',
                height: '16px',
                borderRadius: '3px',
                marginRight: '4px',
                backgroundColor: option.colour || 'transparent' }}
            />
            <div
              style={(option as { toCreate?: boolean }).toCreate ?
                { color: lambdeeTheme.palette.primary.main, } : {}}>
              {option.name}
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Add tag'
            slotProps={{
              ...params.slotProps,
              input: {
                ...(params.slotProps?.input as object),
                endAdornment: (
                  <React.Fragment>
                    {isLoading || isError ? <CircularProgress color='inherit' size={20} /> : null}
                    {(params.slotProps?.input as any)?.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
        filterOptions={(options, params) => {
          const filtered = filter(options as Array<TagShort & { inputValue?: string; toCreate?: boolean }>, params)
          if (params.inputValue !== '') {
            filtered.push({
              id: -1,
              name: `Create "${params.inputValue}"`,
              colour: '',
              url: '',
              inputValue: params.inputValue,
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
              id='create-tag-name-input'
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
          <DialogActions className='create-tag-buttons'>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit'>Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>

  )
}

export default AttachTagSelect
