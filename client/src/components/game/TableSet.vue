<template>
  <div class="container">
    <div class="headerData">
      <h2>{{ displayName }}</h2>
      <h2 class="score">Score: {{ this.player.points }}</h2>
      <h2 class="score">Phase {{ currentPhase }}</h2>
    </div>
    <div class="cardArea">
      <div
        class="cardSet"
        v-for="(phaseItem, phaseIndex) in this.player.phase"
        :key="phaseIndex"
        @click="playSelectedCards(phaseIndex)"
        @mouseenter="handleMouseEnter($event, phaseIndex)"
        @mouseleave="handleMouseLeave"
        @mousemove="handleMouseMove($event, phaseIndex)"
      >
        <p>{{ setLabel(phaseItem) }}</p>

        <!-- Render blank cards if phase doesn't have cards played -->
        <div v-if="!phaseItem.cards.length" class="cards">
          <div class="tableCard" v-for="(card, x) in phaseItem.size" :key="x" />
        </div>

        <!-- Render cards played on phase if they exist -->
        <div v-else class="cards">
          <div class="center arrow">
            <transition name="slide-fade">
              <arrow-right-thick
                :size="18"
                v-if="displayArrow(phaseIndex, 'left')"
              />
            </transition>
          </div>

          <phase-card
            v-for="card in phaseItem.cards"
            :cardData="card"
            :key="card.key"
            :baseClass="'tableCard'"
          />
          <div class="center arrow">
            <transition name="slide-fade">
              <arrow-left-thick
                :size="18"
                v-if="displayArrow(phaseIndex, 'right')"
              />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import ArrowLeftThick from "vue-material-design-icons/ArrowLeftThick.vue";
import ArrowRightThick from "vue-material-design-icons/ArrowRightThick.vue";

export default Vue.component("table-set", {
  name: "TableSet",
  props: ["player"],
  data() {
    return {
      targetPhaseIndex: null,
      targetSideToPlay: null, // 'right' || 'left'
      targetSetClientRect: null,
    };
  },
  components: { ArrowLeftThick, ArrowRightThick },
  computed: {
    phase() {
      return this.player.phase;
    },
    displayName() {
      return this.player.gamename === this.$store.state.gamename
        ? `${this.player.gamename} (You)`
        : this.player.gamename;
    },
    currentPhase() {
      return this.player.phaseNumber;
    },
  },
  methods: {
    handleMouseEnter($event, phaseIndex) {
      this.targetSetClientRect = $event.target.getBoundingClientRect();
      this.targetPhaseIndex = phaseIndex;
    },
    handleMouseMove($event, phaseIndex) {
      const centerX = Math.floor(
        (this.targetSetClientRect.right + this.targetSetClientRect.left) / 2
      );

      if ($event.clientX >= centerX) {
        this.targetSideToPlay = "right";
      } else {
        this.targetSideToPlay = "left";
      }
    },
    handleMouseLeave() {
      this.targetPhaseIndex = null;
      this.targetSideToPlay = null;
    },
    displayArrow(phaseIndex, rightLeft) {
      return (
        phaseIndex === this.targetPhaseIndex &&
        rightLeft === this.targetSideToPlay
      );
    },
    setLabel(phaseItem) {
      if (phaseItem.pattern === "color") {
        return `${phaseItem.size} cards of one color`;
      }
      return `${phaseItem.pattern} of ${phaseItem.size}`;
    },
    playSelectedCards(phaseIndex) {
      const { drew } = this.$store.state.gameState;
      const { selectedCardKeys, hand, playerId } = this.$store.state;

      if (!drew) {
        return this.$store.commit(
          "setProctorMessage",
          "You must draw before playing cards. Take a card from the draw or discard pile!"
        );
      }

      const cards = hand.filter((card) => selectedCardKeys[card.key]);
      const payload = {
        playerId,
        gamename: this.player.gamename,
        phaseIndex,
        cards,
        targetSideToPlay: this.targetSideToPlay,
      };

      this.$socket.emit("playCards", payload);
      this.$store.commit("unSelectAllCards");
    },
    removePlayedCards(phaseItem) {
      console.log("hit remove");
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  text-align: left;
  margin: 10px 40px;

  .headerData {
    display: flex;
    justify-content: space-between;

    h2 {
      margin: 0px 10px 5px 10px;
      padding: 0px;
      font-weight: 500;
      font-size: 18px;
      &.score {
        color: rgb(151, 151, 151);
      }
    }
  }
}
.cardArea {
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;

  .cardSet {
    padding: 10px;
    background-color: #ededed;
    transition: 200ms;

    &:hover {
      background-color: #d3f18b;
      transition: 300ms;
    }

    p {
      padding: 0px;
      margin: 0px 10px;
      color: #8f8f8f;
      text-transform: uppercase;
      font-weight: 500;
      font-size: 10pt;
    }
    .cards {
      display: flex;
    }

    .tableCard {
      height: 60px;
      width: 42px;
      background-color: white;
      border-radius: 5px;
      margin: 5px 4px;
      border: 1px solid #d1d1d1;
    }
  }
}

.center {
  display: flex;
  margin: auto;
}

.arrow {
  width: 18px;
}

.slide-fade-enter-active {
  transition: all 0.35s ease;
  width: 100%;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  color: #ededed;
}

.slide-fade-leave-active {
  transition: all 0.4s ease;
}
</style>
