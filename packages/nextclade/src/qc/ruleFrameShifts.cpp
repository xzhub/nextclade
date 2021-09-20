#include "ruleFrameShifts.h"

#include <nextalign/private/nextalign_private.h>
#include <nextclade/nextclade.h>

#include <optional>

#include "../utils/safe_cast.h"
#include "getQcRuleStatus.h"

namespace Nextclade {
  bool isFrameShiftIgnored(const FrameShiftResult& frameShift, const FrameShiftLocation& ignoredFrameShift) {
    return frameShift.geneName == ignoredFrameShift.geneName && frameShift.codon == ignoredFrameShift.codonRange;
  }

  void filterFrameShifts(const std::vector<FrameShiftResult>& frameShifts, const QCRulesConfigFrameShifts& config,
    std::vector<FrameShiftResult>& frameShiftsReported, std::vector<FrameShiftResult>& frameShiftsIgnored) {
    for (const auto& ignoredFrameShift : config.ignoredFrameShifts) {
      for (const auto& frameShift : frameShifts) {
        if (!isFrameShiftIgnored(frameShift, ignoredFrameShift)) {
          frameShiftsReported.push_back(frameShift);
        } else {
          frameShiftsIgnored.push_back(frameShift);
        }
      }
    }
  }


  std::optional<QcResultFrameShifts> ruleFrameShifts(//
    const AnalysisResult& analysisResult,            //
    const QCRulesConfigFrameShifts& config           //
  ) {
    if (!config.enabled) {
      return {};
    }

    std::vector<FrameShiftResult> frameShiftsReported;
    std::vector<FrameShiftResult> frameShiftsIgnored;
    filterFrameShifts(analysisResult.frameShifts, config, frameShiftsReported, frameShiftsIgnored);
    const int totalFrameShiftsReported = safe_cast<int>(frameShiftsReported.size());
    const int totalFrameShiftsIgnored = safe_cast<int>(frameShiftsIgnored.size());

    const double score = totalFrameShiftsReported * 75;
    const auto& status = getQcRuleStatus(score);

    return QcResultFrameShifts{
      .score = score,
      .status = status,
      .frameShiftsReported = frameShiftsReported,
      .totalFrameShiftsReported = totalFrameShiftsReported,
      .frameShiftsIgnored = frameShiftsIgnored,
      .totalFrameShiftsIgnored = totalFrameShiftsIgnored,
    };
  }
}// namespace Nextclade
