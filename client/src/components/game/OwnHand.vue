<template>
  <div
    class="container"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <div id="marquee" />
    <div class="sortIcons">
      <div class="iconButton">
        <numeric-icon class="icon" @click="sortByValue" />
      </div>

      <div class="iconButton">
        <palette-icon class="icon" @click="sortByColor" />
      </div>
    </div>
    <phase-card
      v-for="card in hand"
      :key="card.key"
      :cardData="card"
      :baseClass="'gameCard'"
      :selectable="true"
    />
  </div>
</template>

<script>
// I wanted to use typescript for this component, but it appears using events with typescript is not well-supported in Vue:
// https://github.com/vuejs/docs/issues/927

/*
  Idea! Marquee is needed AND click_n_drag is needed, so...
  Do like Photoshop. Make buttons (maybe by the color/number sorts) where user selects which cursort they want to use.
  They can do the 4 arrows to drag things around, or the crosshairs to select.

  Elsewhere (TableSet) have a hover div (little triangle speechbox thing) that says "play N cards" and shows little pictures of the selected cards
  That would also show a different message if they can't play there
*/

import Vue from "vue";
import PhaseCard from "./PhaseCard.vue";
import NumericIcon from "vue-material-design-icons/Numeric.vue";
import PaletteIcon from "vue-material-design-icons/Palette.vue";

export default Vue.component("own-hand", {
  name: "OwnHand",
  data() {
    return {
      mouseIsDown: false,
      boxW: 0,
      boxH: 0,
      boxX: 0,
      boxY: 0,
      marquee: null,
      selectedKeys: {},
      cardSortMethod: "",
    };
  },
  components: { PhaseCard, NumericIcon, PaletteIcon },
  mounted() {
    this.marquee = document.getElementById("marquee");
  },
  computed: {
    hand() {
      const hand = this.$store.state.hand;
      if (this.cardSortMethod === "") {
        return hand;
      }
      return hand.sort(
        (a, b) => a[this.cardSortMethod] - b[this.cardSortMethod]
      );
    },
    handEls() {
      return document.getElementsByClassName("gameCard");
    },
  },
  methods: {
    sortByValue() {
      this.cardSortMethod = "value";
    },
    sortByColor() {
      this.cardSortMethod = "color";
    },
    handleMouseDown(event) {
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

      this.mouseIsDown = true;
    },
    handleMouseMove(event) {
      // get card coordinates: getBoundingClientRect()
      // https://stackoverflow.com/questions/288699/get-the-position-of-a-div-span-tag
      if (!this.mouseIsDown) {
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
      const marqueeKeys = getKeysInMarquee(
        this.marquee.getBoundingClientRect(),
        this.handEls
      );

      // select any card not in keysInMarquee
      marqueeKeys.forEach((cardKey) => {
        if (!this.selectedKeys[cardKey]) {
          this.$store.commit("selectCard", cardKey);
          this.selectedKeys[cardKey] = cardKey;
        }
      });

      // select again any card in selectedKeys that is no longer in marqueeKeys
      // this has the effect of un-selecting cards when the marquee shrinks.
      Object.keys(this.selectedKeys).forEach((key) => {
        if (!marqueeKeys.includes(key)) {
          this.$store.commit("selectCard", key); // commit the select again
          delete this.selectedKeys[key]; // remove the key from this.selectedKeys object
        }
      });
    },
    handleMouseUp(event) {
      this.mouseIsDown = false;
      this.marquee.style.display = "none";
      this.marquee.style.height = "0px";
      this.marquee.style.width = "0px";
      this.selectedKeys = {}; // reset this for next marquee.
    },
    // handleMouseOut(event) {
    //   this.handleMouseUp(event); // bail out if goes out of range // bad because lots of things constitute "out"
    // },
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
      isBetween(mqRect.top, mqRect.bottom, cRect.top) ||
      isBetween(mqRect.top, mqRect.bottom, cRect.bottom)
    ) {
      // ensure right and left edges collide
      if (mqRect.left <= cRect.right && mqRect.right >= cRect.left) {
        return cardEl;
      }
    }
  });

  // return just the id of each card.
  return marqueeCards.map((cardEl) => cardEl.id);
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

.sortIcons {
  display: flex;
  flex-direction: column;
  float: left;
  margin: 0px 40px;
}

.iconButton {
  height: 25px;
  width: 25px;
  margin: 5px 0px;
  border-radius: 5px;
  padding: 4px;

  &:hover {
    background-color: #f1f1f1;
    color: rgb(42, 106, 224);
    cursor: pointer;
  }
  .icon {
    margin: 5px 0px;
  }
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
