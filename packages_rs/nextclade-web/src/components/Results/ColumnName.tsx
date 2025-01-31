import React, { useCallback, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { isEmpty, isNil } from 'lodash'
import styled from 'styled-components'

import { analysisResultAtom } from 'src/state/results.state'
import { getSafeId } from 'src/helpers/getSafeId'
import { useTranslationSafe } from 'src/helpers/useTranslationSafe'
import { ColumnNameErrorTooltip, ColumnNameTooltip } from 'src/components/Results/ColumnNameTooltip'
import { Tooltip } from 'src/components/Results/Tooltip'
import { getStatusIconAndText } from 'src/components/Results/getStatusIconAndText'

export const SequenceName = styled.div`
  white-space: nowrap;
  overflow: hidden;
`

export interface ColumnNameProps {
  seqName: string
}

export function ColumnName({ seqName }: ColumnNameProps) {
  const { t } = useTranslationSafe()
  const { result, error } = useRecoilValue(analysisResultAtom(seqName))
  const [showTooltip, setShowTooltip] = useState(false)
  const onMouseEnter = useCallback(() => setShowTooltip(true), [])
  const onMouseLeave = useCallback(() => setShowTooltip(false), [])
  const id = useMemo(() => getSafeId('sequence-label', { seqName }), [seqName])

  const { StatusIcon } = useMemo(
    () =>
      getStatusIconAndText({
        t,
        hasWarnings: !isEmpty(result?.analysisResult.warnings),
        hasErrors: !isNil(error),
      }),
    [error, result?.analysisResult.warnings, t],
  )

  const tooltip = useMemo(() => {
    if (error) {
      return (
        <Tooltip wide fullWidth target={id} isOpen={showTooltip} placement="right-start">
          <ColumnNameErrorTooltip seqName={seqName} error={error} />
        </Tooltip>
      )
    }

    return (
      <Tooltip wide fullWidth target={id} isOpen={showTooltip} placement="right-start">
        <ColumnNameTooltip seqName={seqName} />
      </Tooltip>
    )
  }, [error, id, seqName, showTooltip])

  return (
    <SequenceName id={id} className="w-100" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <StatusIcon />
      {seqName}
      {tooltip}
    </SequenceName>
  )
}
