<template>
  <div
    class="container"
    :class="cursorClass"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @drop="onDrop($event)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div id="marquee" />
    <tool-box
      v-if="!roundIsOver"
      @sortUpdate="setSortType"
      @selectUpdate="setSelectionType"
      @sortHand="handleSortHand"
    />
    <phase-card
      v-for="card in hand"
      :key="card.key"
      :cardData="card"
      :baseClass="'gameCard'"
      :draggable="isDraggable"
      @startDrag="handleStartDrag"
    />
    <button v-if="roundIsOver" @click="advanceRound">Next round</button>
  </div>
</template>

<script>
// I wanted to use typescript for this component, but it appears using events with typescript is not well-supported in Vue:
// https://github.com/vuejs/docs/issues/927

/*
  Idea! 
  TableSet can have a hover div (little triangle speechbox thing) that says "play N cards" and shows little pictures of the selected cards
  That would also show a different message if they can't play there
*/

// todo: there is a pretty big problem with the selectedKeys {} in here not resetting when it should.
// I'd rather this be logically sound than have to change it every little time.
// IDEA: so it resolves itself when someone CLICKS advance round...
// but we just want to fully rerender the hand when the round advances.
// that will reset all the variables for everybody.
// so... when the round advances, we need to change some key on OwnHand to trigger a rerender.
import Vue from "vue";
import PhaseCard from "./PhaseCard.vue";
import { HandSort, HandSelect } from "../../types/toolbox";
import ToolBox from "./toolbox/ToolBox.vue";
import _ from "lodash";

export default Vue.component("own-hand", {
  name: "OwnHand",
  props: ["roundIsOver"],
  data() {
    return {
      mouseIsDown: false,
      boxW: 0,
      boxH: 0,
      boxX: 0,
      boxY: 0,
      marquee: null,
      selectedKeys: {},
      marqueeKeys: {},
      cardSortMethod: HandSort.value,
      cardSelectionMethod: HandSelect.marquee,
    };
  },
  components: { PhaseCard, ToolBox },
  mounted() {
    console.log("rerendered hand.");
    this.marquee = document.getElementById("marquee");
    this.selectedKeys = this.$store.state.selectedCardKeys;
  },
  computed: {
    hand() {
      // this actually does need to be a persistent thing where it sorts each time by the user seleciton.
      // it's a little annoying because the drawn card can be hard to identify, lands in the middle.
      // but that is fixable (with extra work that I don't wanna do)
      const { hand } = this.$store.state;
      return hand;

      // const sortKey =
      //   this.cardSortMethod === HandSort.value ? "value" : "color";

      // return hand.sort((a, b) => a[sortKey] - b[sortKey]);
    },
    handEls() {
      return document.getElementsByClassName("gameCard");
    },
    // roundIsOver() {
    //   const { roundIsOver } = this.$store.state.gameState;
    //   return roundIsOver;
    // },
    cursorClass() {
      const className =
        this.cardSelectionMethod === HandSelect.marquee
          ? "cursorMarquee"
          : "cursorDrag";

      return className;
    },
    isDraggable() {
      return this.cardSelectionMethod === HandSelect.drag;
    },
  },
  methods: {
    setSortType(sortType) {
      this.cardSortMethod = sortType;
    },
    setSelectionType(selectionType) {
      this.cardSelectionMethod = selectionType;
    },
    advanceRound() {
      this.$socket.emit("advanceRound", {
        playerId: this.$store.state.playerId,
      });
    },
    handleSortHand(sortType) {
      const sortKey = sortType === HandSort.value ? "value" : "color";
      const { hand } = this.$store.state;
      hand.sort((a, b) => a[sortKey] - b[sortKey]);
      this.$store.commit("setHandWithoutReorder", hand);
    },
    handleMouseDown(event) {
      if (this.cardSelectionMethod !== HandSelect.marquee) {
        return;
      }

      this.selectedKeys = this.$store.state.selectedCardKeys;

      this.marquee.style.display = "block";

      // get fixed coordinates
      this.boxX = event.clientX;
      this.boxY = event.clientY;

      // set the box position to mouse location
      this.marquee.style.top = event.clientY + "px";
      this.marquee.style.left = event.clientX + "px";

      // set box height and width to zero
      this.marquee.style.width = "0px";
      this.marquee.style.height = "0px";

      this.marqueeKeys = getKeysInMarquee(
        this.marquee.getBoundingClientRect(),
        this.handEls
      );

      const currentKeys = getAllSelectedKeys(
        this.selectedKeys,
        this.marqueeKeys
      );

      this.$store.commit("setSelectedCardKeys", currentKeys);

      this.mouseIsDown = true;
    },
    handleMouseMove(event) {
      // get card coordinates: getBoundingClientRect()
      // https://stackoverflow.com/questions/288699/get-the-position-of-a-div-span-tag
      if (!this.mouseIsDown) {
        return;
      }

      if (this.cardSelectionMethod !== HandSelect.marquee) {
        return;
      }

      // RENDERING OF MARQUEE:
      const coords = getNormalizedCoordinates(
        this.boxX,
        this.boxY,
        event.clientX,
        event.clientY
      );

      this.marquee.style.top = coords.y + "px";
      this.marquee.style.left = coords.x + "px";
      this.marquee.style.height = coords.h + "px";
      this.marquee.style.width = coords.w + "px";

      // SELECTION BY MARQUEE:
      this.marqueeKeys = getKeysInMarquee(
        this.marquee.getBoundingClientRect(),
        this.handEls
      );

      const currentKeys = getAllSelectedKeys(
        this.selectedKeys,
        this.marqueeKeys
      );

      this.$store.commit("setSelectedCardKeys", currentKeys);
    },
    handleMouseUp(event) {
      if (this.cardSelectionMethod !== HandSelect.marquee) {
        return;
      }

      this.mouseIsDown = false;
      this.marquee.style.display = "none";
      this.marquee.style.height = "0px";
      this.marquee.style.width = "0px";

      // save the selected keys to the persisting prop.
      this.selectedKeys = getAllSelectedKeys(
        this.selectedKeys,
        this.marqueeKeys
      );
    },
    handleStartDrag(data) {
      const { event, card } = data;
      // this didn't initially work because I guess you can't do these events directly on a component.
      // they have to be declared on a true DOM element... I guess.
      // at any rate, this never fired here but does fire when declared one layer down on a div.

      if (this.cardSelectionMethod !== HandSelect.drag) {
        return;
      }

      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("key", card.key);
    },
    onDrop(event) {
      if (this.cardSelectionMethod !== HandSelect.drag) {
        return;
      }

      const key = event.dataTransfer.getData("key");
      const { target } = event;
      const { hand } = this.$store.state;

      // if draggedOver is <p>, then they hit the text of the card
      // just means we have to use the parent of that node.
      const draggedOver = target.nodeName === "P" ? target.parentNode : target;
      const dropKey = draggedOver.id;

      // get draggedOver's index in hand and the original index, splice out the card we drew and splice it into this index.
      // that should reorder things!
      const indexCut = _.findIndex(hand, (card) => card.key === key);
      const indexPaste = _.findIndex(hand, (card) => card.key === dropKey);

      // remove and get card that was dragged
      const card = hand.splice(indexCut, 1)[0];

      // insert that card at the drop index
      hand.splice(indexPaste, 0, card);

      // update state
      this.$store.commit("setHandWithoutReorder", hand);
    },
  },
});

function getKeysInMarquee(mqRect, handEls) {
  /*
    If top edge or bottom edge of marquee is between top edge and bottom edge of card:
    get each card where left edge of marquee <= to right edge of card and right edge of marquee is >= left edge of card
  */

  const isBetween = (min, max, val) => val >= min && val <= max;

  const marqueeCards = [...handEls].filter((cardEl) => {
    const cRect = cardEl.getBoundingClientRect();
    if (
      isBetween(cRect.top, cRect.bottom, mqRect.top) ||
      isBetween(cRect.top, cRect.bottom, mqRect.bottom)
    ) {
      // ensure right and left edges collide
      if (mqRect.left <= cRect.right && mqRect.right >= cRect.left) {
        return cardEl;
      }
    }
  });

  // return just the id of each card.
  const keys = {};
  marqueeCards.forEach((cardEl) => (keys[cardEl.id] = true));
  return keys;
}

function getNormalizedCoordinates(originX, originY, newX, newY) {
  const coords = { x: 0, y: 0, h: 0, w: 0 };
  if (originX > newX) {
    coords.x = newX;
    coords.w = originX - newX;
  } else {
    coords.x = originX;
    coords.w = newX - originX;
  }

  if (originY > newY) {
    coords.y = newY;
    coords.h = originY - newY;
  } else {
    coords.y = originY;
    coords.h = newY - originY;
  }

  return coords;
}

function getAllSelectedKeys(prevKeys, marqueeKeys) {
  const keys = { ...prevKeys };
  Object.keys(marqueeKeys).forEach((key) => {
    if (keys[key] !== undefined) {
      keys[key] = !keys[key];
    } else {
      keys[key] = true;
    }
  });

  return keys;
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #dadada;
  cursor: crosshair;
}

.cursorMarquee {
  cursor: crosshair;
}

.cursorDrag {
  cursor: move;
}

#marquee {
  position: fixed;
  display: none;
  height: 0px;
  width: 0px;
  // border: 1px solid rgba(75, 132, 255, 0.4); // this causes blocking behavior.
  background-color: rgba(75, 132, 255, 0.2);
}
</style>
