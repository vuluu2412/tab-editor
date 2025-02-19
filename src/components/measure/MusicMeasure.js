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

   calculateNotePositions(notes, measureWidth, beatsPerMeasure) {
    // Đảm bảo các giá trị đầu vào hợp lệ
    if (!Array.isArray(notes) || notes.length === 0) {
      console.error("⚠️ Lỗi: notes không hợp lệ", notes);
      return [];
    }

    if (!measureWidth || isNaN(measureWidth)) {
      console.error("⚠️ Lỗi: measureWidth không hợp lệ", measureWidth);
      measureWidth = 200; // Giá trị mặc định
    }

    if (!beatsPerMeasure || isNaN(beatsPerMeasure)) {
      console.error("⚠️ Lỗi: beatsPerMeasure không hợp lệ", beatsPerMeasure);
      beatsPerMeasure = 4; // Mặc định 4/4
    }

    let x = 0; // Bắt đầu từ vị trí đầu tiên
    let currentBeat = 0; // Số nhịp hiện tại trong measure

    return notes.map((note, index) => {
      let noteX = x;

      // Kiểm tra note.duration, gán mặc định nếu không có
      let duration = note.duration || 1; // Mặc định là nốt đen
      if (isNaN(duration)) {
        console.warn(`⚠️ Lỗi: duration của note ${index} không hợp lệ`, note);
        duration = 1;
      }

      // Tính độ rộng của nốt dựa trên trường độ (ví dụ: 1 nốt trắng = 2 nốt đen)
      let noteWidth = (duration / beatsPerMeasure) * measureWidth;

      // Cộng dồn vị trí x
      x += noteWidth;
      currentBeat += duration;

      // Nếu hết một measure, reset x về đầu measure tiếp theo
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
      isValid
    } = this.props;
    const adjustedNotes = this.calculateNotePositions(measure.notes, measure.width);


    return (
      <svg height={rowHeight} width={measure.width} className={css(styles.svg)}>
        <Staff
          measureWidth={measure.width}
          y={yTop}
          strings={5}
          isValid={isValid}
          lastMeasure={isLastMeasure}
        />
        {measure.notes.map((note, noteIndex) =>
          this.renderMusicNote(note, noteIndex, yTop, playingNoteIndex)
        )}
        {/*{adjustedNotes.map((note, noteIndex) =>*/}
        {/*  this.renderMusicNote(note, noteIndex, yTop, playingNoteIndex)*/}
        {/*)}*/}

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
            measureWidth={measure.width}
            strings={5}
            y={yTop + 25}
            repeatEnd={measure.repeatEnd}
          />
        )}
        {measure.repeatBegin && (
          <RepeatSign
            measureWidth={measure.width}
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
