from abc import abstractmethod

class NewsBase():
    """Base class of news
    """

    def __init__(self) -> None:
        pass

    @abstractmethod
    def run(self) -> None:
        raise NotImplementedError("run not implement")