import React from 'react'
import SanityFormBuilderContext from './SanityFormBuilderContext'
import {FormBuilderInput} from '../FormBuilderInput'
import {Marker, Type} from '../typedefs'
import {Path} from '../typedefs/path'
import {setLocation} from 'part:@sanity/base/presence'
import * as gradientPatchAdapter from './utils/gradientPatchAdapter'

type PatchChannel = {
  subscribe: () => () => {}
  receivePatches: (patches: Array<any>) => void
}
type Props = {
  value: any | null
  schema: any
  type: Type
  markers: Array<Marker>
  patchChannel: PatchChannel
  onFocus: (arg0: Path) => void
  readOnly: boolean
  onChange: (patches: any[]) => void
  filterField: (field: any) => boolean
  onBlur: () => void
  autoFocus: boolean
  focusPath: Path
}

export default class SanityFormBuilder extends React.Component<Props, {}> {
  static createPatchChannel = SanityFormBuilderContext.createPatchChannel

  _input: FormBuilderInput | null

  setInput = (input: FormBuilderInput | null) => {
    this._input = input
  }

  componentDidMount() {
    const {autoFocus} = this.props
    if (this._input && autoFocus) {
      this._input.focus()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.focusPath !== prevProps.focusPath) {
      setLocation([
        {
          namespace: 'formBuilder',
          documentId: this.props.value._id,
          path: this.props.focusPath
        }
      ])
    }
  }

  handleChange = patchEvent => {
    this.props.onChange(gradientPatchAdapter.toGradient(patchEvent.patches))
  }

  render() {
    const {
      value,
      schema,
      patchChannel,
      type,
      readOnly,
      markers,
      onFocus,
      onBlur,
      focusPath,
      filterField
    } = this.props
    return (
      <SanityFormBuilderContext value={value} schema={schema} patchChannel={patchChannel}>
        <FormBuilderInput
          type={type}
          onChange={this.handleChange}
          level={0}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          markers={markers}
          focusPath={focusPath}
          isRoot
          readOnly={readOnly}
          filterField={filterField}
          ref={this.setInput}
        />
      </SanityFormBuilderContext>
    )
  }
}
