import React, { PureComponent } from 'react';
import { StyleSheet, css } from 'aphrodite';

import MusicNote from './MusicNote';
import Staff from './Staff';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import TempoMarker from './TempoMarker';
import RepeatSign from './RepeatSign';

const styles = StyleSheet.create({
  svg: { overflow: 'visible' },
  measureNumber: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'default',
    fontSize: 9,
    fill: 'tomato'
  }
});

class MusicMeasure extends PureComponent {
  renderMusicNote(note, noteIndex, yTop, playingNoteIndex) {
    const color = playingNoteIndex === noteIndex ? '#f9423a' : 'black';
    if (note.string[0] === 'rest') {
      return (
        <Rest key={noteIndex} x={note.x} y={note.y} note={note} color={color} />
      );
    }

    return note.fret.map((fret, i) => (
      <MusicNote key={i} note={note} chordIndex={i} yTop={yTop} color={color} />
    ));
  }

  calculateNotePositions(notes, measureWidth) {
    if (!Array.isArray(notes) || notes.length === 0) {
      return [];
    }

    if (!measureWidth || isNaN(measureWidth)) {
      measureWidth = 200;
    }

    const durations = notes.map(note => {
      if (note.duration === "w") return 4;
      if (note.duration === "h") return 2;
      if (note.duration === "q") return 1;
      return 1;
    });

    const availableWidth = measureWidth ;

    const totalDuration = durations.reduce((sum, d) => sum + d, 0);

    const baseSpacing = availableWidth / (totalDuration + 1);

    let x = baseSpacing;
    const WIDTH_NOTE = 16;
    return notes.map((note, index) => {
      let noteX = x - WIDTH_NOTE;
      x += durations[index] * baseSpacing;
      return { ...note, x: noteX };
    });
  }





  render() {
    const {
      measure,
      rowHeight,
      yTop,
      playingNoteIndex,
      isLastMeasure,
      isValid,
      isFixed,
      newBarWidth
    } = this.props;
    const widthNew = isFixed ? newBarWidth : measure.width;
    const adjustedNotes = isFixed ? this.calculateNotePositions(measure.notes, widthNew) : measure.notes;


    return (
      <svg height={rowHeight} width={widthNew} className={css(styles.svg)}>
        <Staff
          measureWidth={widthNew}
          y={yTop}
          strings={5}
          isValid={isValid}
          lastMeasure={isLastMeasure}
        />
        {/*{measure.notes.map((note, noteIndex) =>*/}
        {/*  this.renderMusicNote(note, noteIndex, yTop, playingNoteIndex)*/}
        {/*)}*/}
        {adjustedNotes.map((note, noteIndex) =>
          this.renderMusicNote(note, noteIndex, yTop, playingNoteIndex)
        )}

        {measure.indexOfRow === 0 && (
          <Clef y={yTop} strings={5} treble repeatBegin={measure.repeatBegin} />
        )}
        <TimeSignature
          yOffset={yTop}
          strings={5}
          measure={measure}
          repeatBegin={measure.repeatBegin}
        />
        {measure.renderTempo && <TempoMarker y={yTop} tempo={measure.tempo} />}
        <text x={0} y={23 + yTop} className={css(styles.measureNumber)}>
          {measure.measureIndex + 1}
        </text>
        {measure.repeatEnd && (
          <RepeatSign
            measureWidth={widthNew}
            strings={5}
            y={yTop + 25}
            repeatEnd={measure.repeatEnd}
          />
        )}
        {measure.repeatBegin && (
          <RepeatSign
            measureWidth={widthNew}
            strings={5}
            y={yTop + 25}
            repeatEnd={false}
          />
        )}
      </svg>
    );
  }
}

export default MusicMeasure;
