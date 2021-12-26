<script>
  import { PIcon } from '$lib/components/core'
</script>

<div class='absolute flex items-center justify-center -translate-y-full top-1/2 left-1/2 -translate-x-1/2 transform scale-150'>

    <div class=spin>
      <PIcon className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2' type=item name=poke-ball />
    </div>
    <div class='shadow bg-black' />

</div>

<style>
  .spin {
    @apply origin-center;
    animation: loader 2.4s infinite;
  }

  .shadow {
    @apply w-4 h-1 -mb-5;
    border-radius: 100%;
    margin-left: -2px;
    animation: shadow 2.4s infinite;
  }

  @keyframes loader {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 1; }

    0% { transform: translateX(-100px) translateY(0) rotate(0); animation-timing-function: ease-out; }
    12.5% { transform: translateX(-75px) translateY(-48px) rotate(160deg); animation-timing-function: ease-in; }
    25% { transform: translateX(-50px) translateY(0) rotate(360deg); animation-timing-function: ease-out; }
    37.5% {transform: translateX(-25px) translateY(-48px) rotate(580deg); animation-timing-function: ease-in; }
    50% {transform: translateX(0) translateY(0) rotate(760deg); animation-timing-function: ease-out; }

    62.5% {transform: translateX(25px) translateY(-48px) rotate(930deg); animation-timing-function: ease-in; }
    75% {transform: translateX(50px) translateY(0) rotate(1000deg); animation-timing-function: ease-out; }
    87.5% { transform: translateX(75px) translateY(-48px) rotate(1320deg); animation-timing-function: ease-in; }
    100% { transform: translateX(100px) translateY(0) rotate(1440deg); animation-timing-function: ease-out; }
  }

  @keyframes shadow {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 0.25; }

    0% { width: 4px; height: 1px; transform: translateX(-100px); animation-timing-function: ease-out; }
    12.5% { width: 16px; height: 4px; transform: translateX(-75px); animation-timing-function: ease-in; }
    25% { width: 4px;height: 1px; transform: translateX(-50px); animation-timing-function: ease-out; }
    37.5% {width: 16px; height: 4px;  transform: translateX(-25px); animation-timing-function: ease-in; }
    50% { width: 4px; height: 1px; transform: translateX(0); animation-timing-function: ease-out; }

    62.5% {width: 16px; height: 4px;  transform: translateX(25px); animation-timing-function: ease-in; }
    75% { width: 4px; height: 1px; transform: translateX(50px); animation-timing-function: ease-out; }
    87.5% { width: 16px; height: 4px;  transform: translateX(75px); animation-timing-function: ease-in; }
    100% { width: 4px; height: 1px; transform: translateX(100px); animation-timing-function: ease-out; }
  }

  :global(.pkitem-great-ball) {
    width: 18px;
    height: 18px;
    background-position: -304px -246px;
  }
  :global(.pkitem-ultra-ball) {
    width: 18px;
    height: 18px;
    background-position: -83px -322px;
  }

</style>
