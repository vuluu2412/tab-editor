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

   calculateNotePositions(notes, measureWidth, beatsPerMeasure, hasClef) {
    if (!Array.isArray(notes) || notes.length === 0) {
      return [];
    }

    if (!measureWidth || isNaN(measureWidth)) {
      measureWidth = 200;
    }

    if (!beatsPerMeasure || isNaN(beatsPerMeasure)) {
      beatsPerMeasure = 4;
    }

     const clefWidth = hasClef ? 60 : 30;

     let x = clefWidth;
     let currentBeat = 0;

    return notes.map((note, index) => {
      let noteX = x;

      let duration = note.duration || 1;
      if (isNaN(duration)) {
        duration = 1;
      }

      let noteWidth = hasClef ? (duration / beatsPerMeasure) * (measureWidth - clefWidth) : (duration / beatsPerMeasure) * measureWidth;

      x += noteWidth;
      currentBeat += duration;
      if (currentBeat >= beatsPerMeasure) {
        currentBeat = 0;
        x = Math.ceil(x / measureWidth) * measureWidth;
      }

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
    const hasClef = measure.indexOfRow === 0;
    const adjustedNotes = isFixed ? this.calculateNotePositions(measure.notes, widthNew,measure.timeSignature.beats, hasClef) : measure.notes;


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
