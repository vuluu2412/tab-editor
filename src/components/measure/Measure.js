import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { makeMapStateToProps } from '../../util/selectors';
import { makeMeasureSelector } from '../../util/selectors/measure';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import MeasureSelectBox from './MeasureSelectBox';

class Measure extends PureComponent {
  render() {
    const {
      measure,
      playingNoteIndex,
      isLastMeasure,
      isValid,
      yTop,
      tuning,
      selectRange,
      rowHeight,
      isFixed,
      newBarWidth
    } = this.props;
    const measureHeight = rowHeight + tuning.length * 20;

    return (
      <svg height={measureHeight} width={isFixed ? newBarWidth : measure.width}>
        <MusicMeasure
          measure={measure}
          playingNoteIndex={playingNoteIndex}
          isLastMeasure={isLastMeasure}
          isValid={isValid}
          rowHeight={rowHeight}
          yTop={yTop}
          isFixed={isFixed}
          newBarWidth={newBarWidth}
        />
        <TabMeasure
          measure={measure}
          playingNoteIndex={playingNoteIndex}
          isLastMeasure={isLastMeasure}
          isValid={isValid}
          rowHeight={rowHeight}
          stringCount={tuning.length}
          isFixed={isFixed}
          newBarWidth={newBarWidth}
        />
        {selectRange && (
          <MeasureSelectBox
            measure={measure}
            selectRange={selectRange}
            height={measureHeight}
            isFixed={isFixed}
            newBarWidth={newBarWidth}
          />
        )}
      </svg>
    );
  }
}

export default connect(makeMapStateToProps(makeMeasureSelector))(Measure);
