import React, { useCallback, useState } from 'react'

import type { AnalysisResult } from 'src/algorithms/types'
import { getSafeId } from 'src/helpers/getSafeId'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'src/components/Results/Tooltip'

export interface ColumnCladeProps {
  analysisResult: AnalysisResult
}

export function ColumnClade({ analysisResult }: ColumnCladeProps) {
  const { t } = useTranslation()
  const [showTooltip, setShowTooltip] = useState(false)

  const { clade, seqName } = analysisResult
  const id = getSafeId('col-clade', { seqName })
  const cladeText = clade ?? t('Pending...')

  const onMouseEnter = useCallback(() => setShowTooltip(true), [])
  const onMouseLeave = useCallback(() => setShowTooltip(false), [])

  return (
    <div id={id} className="w-100" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {cladeText}
      <Tooltip id={id} isOpen={showTooltip} target={id}>
        <div>{t('Clade: {{cladeText}}', { cladeText })}</div>
      </Tooltip>
    </div>
  )
}
